/**
 * Core logic for the "Order advertising" form: server-side validation,
 * in-memory rate limiting and forwarding to the FormSubmit inbox endpoint.
 * Shared by the Vercel function (api/contact.ts) and the dev server
 * (server.ts). Never import this from client-side code: it contains the
 * destination inbox address, which must not leak into the browser bundle.
 */

const INBOX_ENDPOINT = "https://formsubmit.co/ajax/karbivskij@gmail.com";

// FormSubmit's AJAX endpoint rejects requests without a browser-looking
// identity (it answers "not through a web server"). The proxy re-asserts the
// site's own origin — the real one — since fetch() from Node logs none.
const SITE_ORIGIN = "https://exchange-rates-ukraine.vercel.app";
const SITE_REFERER = `${SITE_ORIGIN}/reklama`;
const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PER_WINDOW = 5;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BUDGET_VALUES = new Set(["", "lt5k", "5-20k", "20-50k", "gt50k"]);
const MAX_SHORT_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 2000;

const BUDGET_LABELS: Record<string, string> = {
  "": "не вказано",
  lt5k: "до 5 000 ₴",
  "5-20k": "5 000 – 20 000 ₴",
  "20-50k": "20 000 – 50 000 ₴",
  gt50k: "понад 50 000 ₴",
};

export interface ContactResult {
  status: number;
  body: { ok: true; activation?: boolean } | { ok: false; error: string; fields?: Record<string, string> };
}

const buckets = new Map<string, { count: number; reset: number }>();

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  if (buckets.size > 1000) {
    for (const [key, bucket] of buckets) {
      if (now >= bucket.reset) buckets.delete(key);
    }
  }
  const bucket = buckets.get(ip);
  if (!bucket || now >= bucket.reset) {
    buckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_MAX_PER_WINDOW;
};

/** Collapse runs of whitespace and clamp length; non-strings become "". */
const text = (value: unknown, maxLength: number): string =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, maxLength) : "";

const consentGiven = (value: unknown): boolean => value === true || value === "true" || value === "on" || value === 1;

export async function submitContactForm(raw: unknown, ip: string, userAgent?: string): Promise<ContactResult> {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const name = text(source.name, MAX_SHORT_FIELD_LENGTH);
  const company = text(source.company, MAX_SHORT_FIELD_LENGTH);
  const email = text(source.email, MAX_SHORT_FIELD_LENGTH).toLowerCase();
  const phone = text(source.phone, 40);
  const budget = text(source.budget, 10);
  const message = typeof source.message === "string" ? source.message.trim().slice(0, MAX_MESSAGE_LENGTH) : "";
  const consent = consentGiven(source.consent);
  const locale = source.locale === "en" ? "en" : "uk";
  // Honeypot: an invisible "website" field that only bots fill.
  const honeypot = text(source.website, MAX_SHORT_FIELD_LENGTH);

  // Bots get a quiet "ok" without forwarding anything to the inbox.
  if (honeypot) return { status: 200, body: { ok: true } };

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "min";
  if (!EMAIL_PATTERN.test(email)) fields.email = "invalid";
  if (message.length < 10) fields.message = "min";
  if (budget && !BUDGET_VALUES.has(budget)) fields.budget = "invalid";
  if (!consent) fields.consent = "required";
  if (Object.keys(fields).length > 0) {
    return { status: 400, body: { ok: false, error: "validation", fields } };
  }

  if (isRateLimited(ip || "unknown")) {
    return { status: 429, body: { ok: false, error: "rate_limit" } };
  }

  const payload = {
    _subject: `Реклама на UAH.today — ${name}`,
    _template: "table",
    _captcha: "false",
    _autoresponse:
      locale === "en"
        ? "Thank you for your advertising request on UAH.today. We will reply within one business day."
        : "Дякуємо за заявку на рекламу на UAH.today. Ми відповімо протягом робочого дня.",
    _replyto: email,
    email,
    "Мова форми": locale === "en" ? "English (/en/advertising)" : "Українська (/reklama)",
    "Ім'я": name,
    "Компанія / проєкт": company || "—",
    Email: email,
    Телефон: phone || "—",
    Бюджет: BUDGET_LABELS[budget] ?? budget,
    Повідомлення: message,
    Надійшло: new Date().toISOString(),
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(INBOX_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Origin: SITE_ORIGIN,
          Referer: SITE_REFERER,
          "User-Agent": userAgent || DEFAULT_UA,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => null)) as {
        success?: unknown;
        message?: unknown;
        error?: unknown;
      } | null;
      const messageText = typeof data?.message === "string" ? data.message : "";

      // First-ever submission (or a deactivated form): FormSubmit accepts the
      // request and emails an "Activate Form" link to the inbox owner.
      if (/activat/i.test(messageText)) {
        return { status: 200, body: { ok: true, activation: true } };
      }

      const successRaw = String(data?.success ?? "")
        .trim()
        .toLowerCase();
      const delivered =
        response.ok &&
        data !== null &&
        data.error === undefined &&
        (successRaw === "true" ||
          (successRaw.length > 0 && !["false", "0"].includes(successRaw)));
      if (delivered) return { status: 200, body: { ok: true } };
      return { status: 502, body: { ok: false, error: "upstream" } };
    } finally {
      clearTimeout(timer);
    }
  } catch {
    return { status: 502, body: { ok: false, error: "upstream" } };
  }
}

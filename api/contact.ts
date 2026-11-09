/**
 * POST /api/contact — advertising order form relayed to the editorial
 * Telegram chat via the Bot API.
 *
 * Delivery details never reach the client: TELEGRAM_BOT_TOKEN and
 * TELEGRAM_CHAT_ID are Vercel/server environment variables, and the site
 * publishes only the form itself. Fully self-contained on purpose: every
 * helper lives in this one file so the Vercel function never depends on
 * imports from outside /api (an earlier ../src import compiled fine but
 * broke the production function invocation with a 500). The dev server
 * (server.ts) reuses this exact handler against an express req/res, keeping
 * local parity with production.
 */

interface ProxyLikeRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, unknown>;
}

interface ProxyLikeResponse {
  setHeader(name: string, value: string): void;
  status(code: number): {
    json(body: unknown): void;
  };
}

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PER_WINDOW = 5;

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

interface ContactResult {
  status: number;
  body:
    | { ok: true }
    | { ok: false; error: string; fields?: Record<string, string>; diag?: Record<string, string> };
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

export async function submitContactForm(raw: unknown, ip: string): Promise<ContactResult> {
  const source = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const name = text(source.name, MAX_SHORT_FIELD_LENGTH);
  const company = text(source.company, MAX_SHORT_FIELD_LENGTH);
  const contact = text(source.contact, MAX_SHORT_FIELD_LENGTH);
  const budget = text(source.budget, 10);
  const message = typeof source.message === "string" ? source.message.trim().slice(0, MAX_MESSAGE_LENGTH) : "";
  const consent = consentGiven(source.consent);
  const locale = source.locale === "en" ? "en" : "uk";
  // Honeypot: an invisible "website" field that only bots fill.
  const honeypot = text(source.website, MAX_SHORT_FIELD_LENGTH);

  // Bots get a quiet "ok" without forwarding anything to the editorial chat.
  if (honeypot) return { status: 200, body: { ok: true } };

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "min";
  if (contact.length < 4) fields.contact = "min";
  if (message.length < 10) fields.message = "min";
  if (budget && !BUDGET_VALUES.has(budget)) fields.budget = "invalid";
  if (!consent) fields.consent = "required";
  if (Object.keys(fields).length > 0) {
    return { status: 400, body: { ok: false, error: "validation", fields } };
  }

  if (isRateLimited(ip || "unknown")) {
    return { status: 429, body: { ok: false, error: "rate_limit" } };
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) {
    console.error("api/contact: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not configured");
    return { status: 503, body: { ok: false, error: "not_configured" } };
  }

  const bodyText = [
    "📩 Реклама на UAH.today — заявка",
    "",
    `Мова: ${locale === "en" ? "EN (/en/advertising)" : "UK (/reklama)"}`,
    `Ім'я: ${name}`,
    `Компанія / проєкт: ${company || "—"}`,
    `Контакт для відповіді: ${contact}`,
    `Бюджет: ${BUDGET_LABELS[budget] ?? budget}`,
    "",
    "Що рекламувати:",
    message,
    "",
    `Надійшло: ${new Date().toISOString()}`,
  ].join("\n");

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: bodyText,
          link_preview_options: { is_disabled: true },
        }),
        signal: controller.signal,
      });
      const data = (await response.json().catch(() => null)) as { ok?: unknown; description?: unknown } | null;
      if (response.ok && data?.ok === true) {
        return { status: 200, body: { ok: true } };
      }
      const description = typeof data?.description === "string" ? data.description.slice(0, 140) : "";
      return {
        status: 502,
        body: {
          ok: false,
          error: "upstream",
          diag: {
            upstreamStatus: response.ok ? "ok" : String(response.status) || "unknown",
            upstreamMessage: description,
          },
        },
      };
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    // Surface the fetch failure chain so production failures are
    // distinguishable (DNS reset vs TLS vs abort); retained fields never
    // include request payload details.
    const err = error as { name?: string; message?: string; cause?: { code?: string; message?: string } };
    const cause = err?.cause;
    const diag: Record<string, string> = {
      detail: [err?.name, err?.message, cause?.code, cause?.message].filter(Boolean).join(" | ").slice(0, 200),
    };
    return { status: 502, body: { ok: false, error: "upstream", diag } };
  }
}

const headerValue = (headers: ProxyLikeRequest["headers"], name: string): string => {
  if (!headers) return "";
  const value = headers[name];
  return String(Array.isArray(value) ? value[0] ?? "" : value ?? "").trim();
};

export default async function handler(req: ProxyLikeRequest, res: ProxyLikeResponse): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  res.setHeader("Cache-Control", "no-store");

  const ip = headerValue(req.headers, "x-forwarded-for").split(",")[0].trim() || "unknown";

  // Vercel's Node runtime parses application/json POST bodies into req.body
  // (the dev server applies express.json() before delegating to this handler).
  const result = await submitContactForm(req.body ?? null, ip);
  res.status(result.status).json(result.body);
}

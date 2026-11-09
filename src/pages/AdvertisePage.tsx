import React, { useState } from "react";
import { AlertTriangle, ArrowUpRight, BarChart3, CheckCircle2, Clock, Megaphone, Send, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Locale } from "../constants";

interface AdvertisePageProps {
  locale?: Locale;
}

// This page never shows the recipient's contact details: the composed request
// goes to /api/contact, and the serverless layer relays it privately to the
// editorial chat. Nothing about the destination is exposed in this bundle.
const FIELD_CLASS =
  "h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none ring-brand-500/20 focus:ring-4 dark:border-[#2E2E2E] dark:bg-[#202020]";
const TEXTAREA_CLASS =
  "rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal outline-none ring-brand-500/20 focus:ring-4 dark:border-[#2E2E2E] dark:bg-[#202020]";
const INVALID_CLASS = " border-red-400 dark:border-red-500/70";

const BUDGET_OPTIONS = [
  { value: "lt5k", uk: "до 5 000 ₴", en: "under ₴5,000" },
  { value: "5-20k", uk: "5 000 – 20 000 ₴", en: "₴5,000 – ₴20,000" },
  { value: "20-50k", uk: "20 000 – 50 000 ₴", en: "₴20,000 – ₴50,000" },
  { value: "gt50k", uk: "понад 50 000 ₴", en: "over ₴50,000" },
];

// Reply-channel select keeps the delivery target unambiguous for the editorial
// team; the value side picks up a matching placeholder per channel.
const CHANNEL_PLACEHOLDERS: Record<string, { uk: string; en: string }> = {
  telegram: { uk: "@username у Telegram", en: "@username in Telegram" },
  viber: { uk: "+380… або @username у Viber", en: "+380… or @username in Viber" },
  phone: { uk: "+380…", en: "+380…" },
  email: { uk: "you@example.com", en: "you@example.com" },
};

export const AdvertisePage: React.FC<AdvertisePageProps> = ({ locale = "uk" }) => {
  const isEnglish = locale === "en";

  const [fields, setFields] = useState({ name: "", company: "", contact: "", channel: "telegram", budget: "", message: "", website: "" });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);
  const [failure, setFailure] = useState<"validation" | "rate_limit" | "network" | "upstream" | null>(null);

  const setValue = (key: keyof typeof fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((prev) => ({ ...prev, [key]: event.target.value }));

  const errorClass = (key: string) => (fieldErrors?.[key] ? INVALID_CLASS : "");

  const failureText = () => {
    switch (failure) {
      case "validation":
        return isEnglish ? "Please check the highlighted fields and try again." : "Перевірте підсвічені поля і спробуйте ще раз.";
      case "rate_limit":
        return isEnglish ? "Too many requests. Please try again in about 10 minutes." : "Забагато спроб. Спробуйте приблизно за 10 хвилин.";
      case "network":
        return isEnglish ? "Could not reach the form endpoint. Check your connection and try again." : "Не вдалося звернутися до форми. Перевірте з'єднання і спробуйте ще раз.";
      default:
        return isEnglish ? "The form endpoint is temporarily unavailable. Please try again a bit later." : "Сервіс форми тимчасово недоступний. Спробуйте трохи пізніше.";
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("loading");
    setFieldErrors(null);
    setFailure(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, consent, locale }),
      });
      const payload = (await response.json().catch(() => null)) as { ok?: boolean; error?: string; fields?: Record<string, string> } | null;
      if (response.ok && payload?.ok) {
        setStatus("success");
        return;
      }
      if (response.status === 400) {
        setFieldErrors(payload?.fields ?? {});
        setFailure("validation");
      } else if (response.status === 429) {
        setFailure("rate_limit");
      } else {
        setFailure("upstream");
      }
      setStatus("error");
    } catch {
      setFailure("network");
      setStatus("error");
    }
  };

  const places = [
    {
      icon: <BarChart3 size={16} />,
      title: isEnglish ? "Comparison tables" : "Порівняльні таблиці",
      text: isEnglish
        ? "Sponsored slots next to the main rate table and the PrivatBank / monobank / NBU course pages."
        : "Спонсорські лоти біля головної таблиці курсів та на сторінках ПриватБанку, monobank і НБУ.",
    },
    {
      icon: <Users size={16} />,
      title: isEnglish ? "Purchase-ready audience" : "Аудиторія, готова до дії",
      text: isEnglish
        ? "Visitors come to pick a bank and exchange currency — the decision happens right on our pages."
        : "Відвідувачі заходять обрати банк і обміняти валюту — рішення приймається прямо на наших сторінках.",
    },
    {
      icon: <Megaphone size={16} />,
      title: isEnglish ? "Flexible formats" : "Гнучкі формати",
      text: isEnglish
        ? "Banners, converter branding, sponsored history blocks: by the week, month or quarter."
        : "Банери, брендування конвертера, спонсорські блоки історії курсів: на тиждень, місяць або квартал.",
    },
    {
      icon: <ShieldCheck size={16} />,
      title: isEnglish ? "Independent and transparent" : "Незалежно і прозоро",
      text: isEnglish
        ? "Ads never affect rate data or rankings; sponsored blocks are always labelled."
        : "Реклама ніколи не впливає на дані курсів чи рейтинг; спонсорські блоки завжди позначені.",
    },
  ];

  return (
    <main className="mx-auto max-w-4xl py-8">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020] md:p-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-[#2E2E2E]">
          <div className="rounded-xl bg-brand-600/10 p-2.5 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
              {isEnglish ? "Advertise on UAH.today" : "Реклама на UAH.today"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#ADB7BE] sm:text-sm">
              {isEnglish
                ? "Put your brand in front of people who are choosing where to exchange currency right now"
                : "Ваш бренд перед людьми, які саме зараз обирають, де вигідно міняти валюту"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {/* Selling points */}
          <div className="flex flex-col gap-3">
            {places.map((place) => (
              <div key={place.title} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]">
                <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
                  {place.icon}
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{place.title}</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-[#ADB7BE]">{place.text}</p>
              </div>
            ))}

            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-[#ADB7BE]">
              <Clock size={14} className="shrink-0 text-brand-700 dark:text-brand-400" />
              <span>
                {isEnglish
                  ? "We reply to every request within one business day (Mon–Fri, 09:00–18:00, Kyiv)."
                  : "Відповідаємо на кожну заявку протягом робочого дня (Пн–Пт, 09:00–18:00, Київ)."}
              </span>
            </div>
          </div>

          {/* Order form */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-[#2E2E2E] dark:bg-[#121212]/50">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 size={40} className="text-emerald-500" />
                <h3 className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
                  {isEnglish ? "Request sent" : "Заявку надіслано"}
                </h3>
                <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-[#ADB7BE]">
                  {isEnglish
                    ? "Thank you. Your advertising request has reached the editorial team — expect a reply at the contact you provided within one business day."
                    : "Дякуємо. Заявка вже у редакції — відповідь надійде за контактом, який ви вказали, протягом робочого дня."}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFields({ name: "", company: "", contact: "", channel: "telegram", budget: "", message: "", website: "" });
                    setConsent(false);
                    setStatus("idle");
                  }}
                  className="learn-more mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-400"
                >
                  {isEnglish ? "Fill in a new request" : "Заповнити нову заявку"}
                  <ArrowUpRight className="learn-more-icon" size={12} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
                <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                  {isEnglish ? "Request advertising placement" : "Замовити рекламу"}
                </h3>

                {status === "error" && (
                  <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                    <span>{failureText()}</span>
                  </div>
                )}

                {/* Honeypot: hidden from humans, filled by bots; server drops such submissions */}
                <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={setValue("website")} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-[#ADB7BE]">
                    <span>{isEnglish ? "Your name *" : "Ваше ім'я *"}</span>
                    <input required type="text" value={fields.name} onChange={setValue("name")} className={FIELD_CLASS + errorClass("name")} />
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-[#ADB7BE]">
                    <span>{isEnglish ? "Company / project" : "Компанія / проєкт"}</span>
                    <input type="text" value={fields.company} onChange={setValue("company")} className={FIELD_CLASS + errorClass("company")} />
                  </label>
                </div>

                <div className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-[#ADB7BE]">
                  <span>{isEnglish ? "Where should we send the reply? *" : "Куди надіслати відповідь? *"}</span>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={fields.channel}
                      onChange={setValue("channel")}
                      aria-label={isEnglish ? "Reply channel" : "Спосіб зв'язку"}
                      className={FIELD_CLASS + errorClass("channel") + " shrink-0 sm:w-40"}
                    >
                      <option value="telegram">Telegram</option>
                      <option value="viber">Viber</option>
                      <option value="phone">{isEnglish ? "Phone" : "Телефон"}</option>
                      <option value="email">Email</option>
                    </select>
                    <input
                      required
                      type="text"
                      value={fields.contact}
                      onChange={setValue("contact")}
                      placeholder={CHANNEL_PLACEHOLDERS[fields.channel]?.[isEnglish ? "en" : "uk"] ?? ""}
                      aria-label={isEnglish ? "Your contact" : "Ваш контакт"}
                      className={FIELD_CLASS + errorClass("contact") + " flex-1"}
                    />
                  </div>
                </div>

                <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-[#ADB7BE]">
                  <span>{isEnglish ? "Budget" : "Орієнтовний бюджет"}</span>
                  <select value={fields.budget} onChange={setValue("budget")} className={FIELD_CLASS + errorClass("budget")}>
                    <option value="">{isEnglish ? "Not decided yet" : "Ще не визначив"}</option>
                    {BUDGET_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {isEnglish ? option.en : option.uk}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-[#ADB7BE]">
                  <span>{isEnglish ? "What do you want to advertise? *" : "Що хочете прорекламувати? *"}</span>
                  <textarea
                    required
                    minLength={10}
                    rows={4}
                    value={fields.message}
                    onChange={setValue("message")}
                    className={TEXTAREA_CLASS + errorClass("message")}
                  />
                </label>

                <label className="flex items-start gap-2.5 text-xs font-normal text-slate-600 dark:text-[#ADB7BE]">
                  <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 accent-brand-700 dark:accent-brand-400" />
                  <span>
                    {isEnglish ? "I agree that my name, contacts and message will be processed to answer this request, per the " : "Погоджуюсь на обробку імені, контактів і повідомлення для відповіді на заявку, згідно з "}
                    <Link to={isEnglish ? "/en/privacy-policy" : "/privacy-policy"} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
                      {isEnglish ? "Privacy Policy" : "Політикою конфіденційності"}
                    </Link>
                    . *
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  <Send size={14} />
                  {status === "loading" ? (isEnglish ? "Sending…" : "Надсилаємо…") : isEnglish ? "Send request" : "Надіслати заявку"}
                </button>

                <p className="text-[11px] leading-4 text-slate-400 dark:text-[#7b868d]">
                  {isEnglish
                    ? "The request is delivered to the editorial team over the server — recipients and delivery details are never shown on the page or in the browser bundle."
                    : "Заявка доставляється редакції через сервер — адреси та деталі доставки не публікуються на сторінці й у браузерному бандлі."}
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Cross-link from the contact page pattern */}
        <div className="mt-8 border-t border-slate-100 pt-5 text-xs text-slate-500 dark:border-[#2E2E2E] dark:text-[#ADB7BE]">
          <Link
            to={isEnglish ? "/en/contact" : "/kontakty"}
            className="learn-more inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline dark:text-brand-400"
          >
            {isEnglish ? "General contacts instead →" : "Загальні контакти →"}
            <ArrowUpRight className="learn-more-icon" size={12} />
          </Link>
        </div>
      </article>
    </main>
  );
};

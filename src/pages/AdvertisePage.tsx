import React, { useState } from "react";
import { ArrowUpRight, BarChart3, CheckCircle2, Clock, Megaphone, Send, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Locale } from "../constants";

interface AdvertisePageProps {
  locale?: Locale;
}

// Editorial Telegram is the delivery channel: the form composes the request
// locally, copies it to the clipboard and opens this chat. Nothing is sent to
// a server endpoint and no personal email address reaches the client bundle.
const TELEGRAM_URL = "https://t.me/lil_turtleee";

const FIELD_CLASS =
  "h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal outline-none ring-brand-500/20 focus:ring-4 dark:border-[#2E2E2E] dark:bg-[#202020]";
const TEXTAREA_CLASS =
  "rounded-lg border border-slate-200 bg-white p-3 text-sm font-normal outline-none ring-brand-500/20 focus:ring-4 dark:border-[#2E2E2E] dark:bg-[#202020]";

const BUDGET_OPTIONS = [
  { value: "lt5k", uk: "до 5 000 ₴", en: "under ₴5,000" },
  { value: "5-20k", uk: "5 000 – 20 000 ₴", en: "₴5,000 – ₴20,000" },
  { value: "20-50k", uk: "20 000 – 50 000 ₴", en: "₴20,000 – ₴50,000" },
  { value: "gt50k", uk: "понад 50 000 ₴", en: "over ₴50,000" },
];

export const AdvertisePage: React.FC<AdvertisePageProps> = ({ locale = "uk" }) => {
  const isEnglish = locale === "en";

  const [fields, setFields] = useState({ name: "", company: "", budget: "", message: "" });
  const [result, setResult] = useState<{ copied: boolean; opened: boolean; text: string } | null>(null);

  const setValue = (key: keyof typeof fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((prev) => ({ ...prev, [key]: event.target.value }));

  const composeMessage = () => {
    const budget = BUDGET_OPTIONS.find((option) => option.value === fields.budget);
    const budgetLabel = budget ? (isEnglish ? budget.en : budget.uk) : isEnglish ? "not decided yet" : "ще не визначив";
    return [
      isEnglish ? "Advertising request — UAH.today" : "Заявка на рекламу — UAH.today",
      `${isEnglish ? "Name" : "Ім'я"}: ${fields.name}`,
      `${isEnglish ? "Company" : "Компанія"}: ${fields.company || "—"}`,
      `${isEnglish ? "Budget" : "Бюджет"}: ${budgetLabel}`,
      "",
      `${isEnglish ? "What to advertise" : "Що рекламувати"}: ${fields.message}`,
    ].join("\n");
  };

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for browsers that deny the async clipboard API.
      try {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.left = "-9999px";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(helper);
        return copied;
      } catch {
        return false;
      }
    }
  };

  // window.open must run synchronously inside the submit gesture, otherwise
  // popup blockers swallow it; the clipboard write can safely follow later.
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const text = composeMessage();
    const opened = window.open(TELEGRAM_URL, "_blank");
    if (opened) opened.opener = null;
    copyToClipboard(text).then((copied) => setResult({ copied, opened: opened !== null, text }));
  };

  const reset = () => {
    setFields({ name: "", company: "", budget: "", message: "" });
    setResult(null);
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

          {/* Request form → Telegram */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-[#2E2E2E] dark:bg-[#121212]/50">
            {result ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center text-center">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                  <h3 className="mt-3 text-lg font-semibold text-slate-950 dark:text-white">
                    {isEnglish ? "Almost there — paste the request in Telegram" : "Майже готово — вставте заявку в Telegram"}
                  </h3>
                  <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-[#ADB7BE]">
                    {result.opened && result.copied
                      ? isEnglish
                        ? "A new tab with the editorial Telegram chat just opened, and the request text is in your clipboard. Paste it (Ctrl+V) and send."
                        : "Нова вкладка з чатом редакції у Telegram щойно відкрилась, текст заявки скопійовано. Вставте його в чат (Ctrl+V) і надішліть."
                      : result.opened
                        ? isEnglish
                          ? "The Telegram chat opened in a new tab. Copy the request text below and paste it into the chat."
                          : "Чат Telegram відкрився у новій вкладці. Скопіюйте текст заявки нижче та вставте його в чат."
                        : result.copied
                          ? isEnglish
                            ? "The chat could not open automatically (pop-up blockers do that). The request text is copied — open the chat with the button below."
                            : "Автоматично відкрити чат не вдалося (так роблять блокувальники поп-апів). Текст заявки скопійовано — відкрийте чат кнопкою нижче."
                          : isEnglish
                            ? "Below is the composed request text. Copy it manually and open the chat with the button below."
                            : "Нижче — текст заявки. Скопіюйте його вручну та відкрийте чат кнопкою нижче."}
                  </p>
                </div>

                {!result.copied && (
                  <textarea
                    readOnly
                    rows={7}
                    value={result.text}
                    onFocus={(event) => event.currentTarget.select()}
                    className={TEXTAREA_CLASS + " font-mono text-xs"}
                  />
                )}

                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  <Send size={14} />
                  {isEnglish ? "Open the Telegram chat" : "Відкрити чат Telegram"}
                </a>

                <button
                  type="button"
                  onClick={reset}
                  className="learn-more inline-flex items-center justify-center gap-1 text-xs font-semibold text-brand-700 hover:underline dark:text-brand-400"
                >
                  {isEnglish ? "Fill in a new request" : "Заповнити нову заявку"}
                  <ArrowUpRight className="learn-more-icon" size={12} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h3 className="text-base font-semibold text-slate-950 dark:text-white">
                  {isEnglish ? "Request advertising placement" : "Замовити рекламу"}
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-[#ADB7BE]">
                    <span>{isEnglish ? "Your name *" : "Ваше ім'я *"}</span>
                    <input required type="text" value={fields.name} onChange={setValue("name")} className={FIELD_CLASS} />
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-[#ADB7BE]">
                    <span>{isEnglish ? "Company / project" : "Компанія / проєкт"}</span>
                    <input type="text" value={fields.company} onChange={setValue("company")} className={FIELD_CLASS} />
                  </label>
                </div>

                <label className="flex flex-col gap-1.5 text-xs font-bold text-slate-700 dark:text-[#ADB7BE]">
                  <span>{isEnglish ? "Budget" : "Орієнтовний бюджет"}</span>
                  <select value={fields.budget} onChange={setValue("budget")} className={FIELD_CLASS}>
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
                    className={TEXTAREA_CLASS}
                  />
                </label>

                <p className="text-[11px] leading-4 text-slate-400 dark:text-[#7b868d]">
                  {isEnglish
                    ? "Nothing is sent to the site server: the request text is composed in your browser, copied to the clipboard, and you paste it into the editorial Telegram chat @lil_turtleee. Further data handling follows the "
                    : "Нічого не надсилається на сервер сайту: текст заявки формується у вашому браузері, копіюється в буфер обміну, і ви вставляєте його в чат Telegram редакції @lil_turtleee. Подальшу обробку даних описує "}
                  <Link to={isEnglish ? "/en/privacy-policy" : "/privacy-policy"} className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
                    {isEnglish ? "Privacy Policy" : "Політика конфіденційності"}
                  </Link>
                  .
                </p>

                <button
                  type="submit"
                  className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                >
                  <Send size={14} />
                  {isEnglish ? "Continue in Telegram" : "Продовжити в Telegram"}
                </button>
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

import React, { useMemo } from "react";
import { ArrowRight, Bot, CheckCircle2, Globe2, RefreshCw, ShieldCheck, SunMoon } from "lucide-react";
import { CurrencyCard } from "../components/CurrencyCard";
import { CurrencyConverter } from "../components/CurrencyConverter";
import { FullFAQ } from "../components/FullFAQ";
import { RatesTable } from "../components/RatesTable";
import { CURRENCY_CODES, Locale, UI_COPY } from "../constants";
import { formatDateTime, formatRate, getBestRates, getSourceSummary, normalizeRates, RawRatesResponse } from "../lib/rates";

interface DashboardProps {
  data: RawRatesResponse | null;
  loading: boolean;
  error: string | null;
  fetchData: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  data,
  loading,
  error,
  fetchData,
  darkMode,
  setDarkMode,
  locale,
  setLocale,
}) => {
  const rates = useMemo(() => normalizeRates(data), [data]);
  const sources = useMemo(() => getSourceSummary(data), [data]);
  const updatedAt = data?.updatedAt || null;
  const copy = UI_COPY[locale];
  const isEnglish = locale === "en";

  const heroRates = CURRENCY_CODES.slice(0, 3).map((code) => {
    const { bestBuy, bestSell } = getBestRates(rates, code);
    const nbu = rates.find((rate) => rate.code === code && rate.bankId === "nbu")?.nbu ?? null;
    return { code, bestBuy, bestSell, nbu };
  });

  return (
    <>
      <header className="relative -mx-4 -mt-4 overflow-hidden bg-white text-slate-950 dark:bg-slate-950 dark:text-white sm:-mx-6 lg:-mx-8">
        <div className="absolute inset-0 hidden opacity-45 dark:block">
          <video aria-hidden="true" autoPlay className="hidden h-full w-full object-cover md:block" loop muted playsInline preload="metadata">
            <source src="/hero-fintech.webm" type="video/webm" />
          </video>
          <img className="h-full w-full object-cover md:hidden" src="/hero-mobile.webp" alt="" loading="eager" />
        </div>
        <div className="absolute inset-0 hidden bg-slate-950/45 dark:block" />

        <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-4 py-3 sm:px-6 lg:px-8">
          <nav className="border-b border-slate-200/80 py-3 dark:border-white/10">
            <div className="flex items-center justify-between gap-3">
              <a className="text-lg font-black tracking-tight" href="/">
                UAH.today
              </a>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex h-10 items-center gap-1 rounded-md border border-slate-200 px-3 text-sm font-black transition active:scale-[0.98] dark:border-white/15"
                  onClick={() => setLocale(isEnglish ? "uk" : "en")}
                  type="button"
                >
                  <Globe2 size={15} /> {isEnglish ? "UK" : "EN"}
                </button>
                <button
                  aria-label={isEnglish ? "Toggle theme" : "Перемкнути тему"}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 transition active:scale-[0.98] dark:border-white/15"
                  onClick={() => setDarkMode(!darkMode)}
                  type="button"
                >
                  <SunMoon size={16} />
                </button>
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              <a className="shrink-0 rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] dark:text-slate-200 dark:hover:bg-white/10" href="#rates-table">
                {copy.navRates}
              </a>
              <a className="shrink-0 rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] dark:text-slate-200 dark:hover:bg-white/10" href="#converter">
                {copy.navConverter}
              </a>
              <a className="shrink-0 rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98] dark:text-slate-200 dark:hover:bg-white/10" href="#faq">
                {copy.faq}
              </a>
            </div>
          </nav>

          <section className="grid flex-1 gap-8 py-10 md:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="max-w-3xl self-center">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-200">
                {copy.eyebrow}
              </p>
              <h1 className="text-4xl font-black leading-none tracking-tight md:text-6xl">
                {copy.heroTitle}
              </h1>
              <p className="mt-5 max-w-[65ch] text-base leading-7 text-slate-600 dark:text-slate-200 md:text-lg">
                {copy.heroSubtitle}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a className="rounded-lg bg-cyan-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-400 active:scale-[0.98]" href="#rates-table">
                  {copy.viewRates} <ArrowRight className="inline" size={16} />
                </a>
                <a className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-black transition hover:bg-slate-100 active:scale-[0.98] dark:border-white/25 dark:hover:bg-white/10" href="#converter">
                  {copy.converter}
                </a>
              </div>

              <div className="mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
                {heroRates.map((item) => (
                  <article className="border-t border-slate-200 pt-4 dark:border-white/15" key={item.code}>
                    <p className="font-mono text-sm font-black text-cyan-700 dark:text-cyan-200">{item.code}/UAH</p>
                    <p className="mt-2 font-mono text-3xl font-black">{formatRate(item.bestSell?.sell ?? item.nbu)}</p>
                    <p className="mt-1 text-xs font-bold text-slate-500 dark:text-slate-300">
                      {copy.sell} {formatRate(item.bestSell?.sell)} · {copy.buy} {formatRate(item.bestBuy?.buy)}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="self-end rounded-xl border border-slate-200 bg-white p-5 shadow-[0_20px_40px_-24px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-950/55 dark:shadow-none dark:backdrop-blur">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">{copy.lastUpdate}</p>
              <p className="mt-2 text-2xl font-black">{formatDateTime(updatedAt, isEnglish ? "en-US" : "uk-UA")}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-200">{copy.definitions}</p>
              <button
                className="mt-4 rounded-md bg-slate-950 px-3 py-2 text-sm font-black text-white transition active:scale-[0.98] disabled:opacity-60 dark:bg-white dark:text-slate-950"
                disabled={loading}
                onClick={fetchData}
                type="button"
              >
                <RefreshCw className={loading ? "inline animate-spin" : "inline"} size={15} /> {copy.refresh}
              </button>

              <div className="mt-5 border-t border-slate-200 pt-4 dark:border-white/10">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">{copy.liveSources}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {sources.map((source) => (
                    <div className="flex items-center gap-2 text-xs font-bold" key={source.id}>
                      <CheckCircle2 className={source.ok ? "text-cyan-600 dark:text-cyan-300" : "text-amber-500"} size={14} />
                      <span>{source.shortName}</span>
                      <span className="text-slate-400">{source.ok ? copy.available : copy.unavailable}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </section>
        </div>
      </header>

      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          {error}
        </div>
      ) : null}

      <section aria-label={isEnglish ? "Key exchange rate cards" : "Ключові картки курсів валют"} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {CURRENCY_CODES.map((code) => (
          <CurrencyCard code={code} key={code} locale={locale} rates={rates} updatedAt={updatedAt} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <RatesTable rates={rates} updatedAt={updatedAt} locale={locale} />
          <CurrencyConverter rates={rates} locale={locale} />
        </div>
        <aside className="hidden flex-col gap-5 xl:flex">
          <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <ShieldCheck className="text-cyan-600" size={24} />
            <h2 className="mt-3 text-lg font-black text-slate-950 dark:text-white">{copy.trustTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.trustBody}</p>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <Bot className="text-cyan-600" size={24} />
            <h2 className="mt-3 text-lg font-black text-slate-950 dark:text-white">{copy.aiTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{copy.aiBody}</p>
          </section>
        </aside>
      </section>

      <FullFAQ locale={locale} />
    </>
  );
};

import React, { lazy, Suspense, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, Bot, CheckCircle2, Globe2, RefreshCw, ShieldCheck, SunMoon, AlertCircle } from "lucide-react";
import { CurrencyCard } from "../components/CurrencyCard";
import { CurrencyConverter } from "../components/CurrencyConverter";
import { FullFAQ } from "../components/FullFAQ";
import { RatesTable } from "../components/RatesTable";
import { BestRateFinder } from "../components/BestRateFinder";
import { MarketInsights } from "../components/MarketInsights";
import { EditorialContent } from "../components/EditorialContent";
import { AdSlot } from "../components/AdSlot";
import { CURRENCY_CODES, Locale, UI_COPY } from "../constants";
import { formatDateTime, formatRate, getBestRates, getSourceSummary, normalizeRates, RawRatesResponse } from "../lib/rates";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const UsdHistoryChart = lazy(() => import("../components/UsdHistoryChart").then((module) => ({ default: module.UsdHistoryChart })));

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
  const { pathname } = useLocation();
  const rates = useMemo(() => normalizeRates(data), [data]);
  const sources = useMemo(() => getSourceSummary(data), [data]);
  const updatedAt = data?.updatedAt || null;
  const copy = UI_COPY[locale];
  const isEnglish = locale === "en";

  // Derive initial tab and topic from pathname
  const initialTab = useMemo(() => {
    if (pathname.includes("kurs-nbu")) return "nbu";
    if (pathname.includes("converter") || pathname.includes("konverter")) return "converter";
    return "banks";
  }, [pathname]);

  const [activeTab, setActiveTab] = useState(initialTab);

  const topic = useMemo(() => {
    if (pathname.includes("dolara") || pathname.includes("usd")) return "usd";
    if (pathname.includes("evro") || pathname.includes("eur")) return "eur";
    if (pathname.includes("zlotogo")) return "pln";
    if (pathname.includes("funta")) return "gbp";
    if (pathname.includes("nbu")) return "nbu";
    return "general";
  }, [pathname]);

  return (
    <>
      {/* Modern Fintech Header & Quick Bar */}
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              {copy.eyebrow}
            </span>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
              {copy.heroSubtitle}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <a href="#best-rates" className="rounded-lg bg-slate-950 px-3 py-1.5 font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
                {copy.navBest} &darr;
              </a>
              <a href="#rates-table" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                {copy.navRates}
              </a>
              <a href="#converter" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                {copy.navConverter}
              </a>
              <a href="#market-insights" className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
                {copy.navInsights}
              </a>
            </div>
          </div>

          {/* Quick Refresh & Source Health Panel */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60 lg:min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {copy.lastUpdate}
              </span>
              <button
                type="button"
                disabled={loading}
                onClick={fetchData}
                aria-label={copy.refresh}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-black text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 active:scale-[0.98] disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <RefreshCw size={12} className={loading ? "animate-spin text-cyan-600" : ""} />
                <span>{copy.refresh}</span>
              </button>
            </div>

            <div className="font-mono text-base font-black text-slate-900 dark:text-white">
              {formatDateTime(updatedAt, isEnglish ? "en-US" : "uk-UA")}
            </div>

            <div className="border-t border-slate-200/60 pt-2.5 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {copy.liveSources}
              </div>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5 text-[11px] font-bold">
                {sources.slice(0, 6).map((source) => (
                  <div key={source.id} className="flex items-center gap-1 text-slate-700 dark:text-slate-300" title={`${source.name}: ${source.ok ? copy.available : copy.unavailable}`}>
                    <CheckCircle2 size={12} className={source.ok ? "text-emerald-500" : "text-amber-500"} />
                    <span className="truncate">{source.shortName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      ) : null}

      {/* 1. Best Rate Finder (PRD Section 3.5) */}
      <BestRateFinder rates={rates} locale={locale} />

      {/* 2. Key Currency Cards (PRD Section 3.2) */}
      <section aria-label={isEnglish ? "Currency overview cards" : "Огляд курсів валют"} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CURRENCY_CODES.map((code) => (
          <CurrencyCard code={code} key={code} locale={locale} rates={rates} updatedAt={updatedAt} />
        ))}
      </section>

      {/* Non-intrusive Ad Placement 1 */}
      <AdSlot slotId="ad-top-banner" locale={locale} />

      {/* 3. Smart Currency Converter (PRD Section 3.4) */}
      <CurrencyConverter rates={rates} locale={locale} />

      {/* 4. Currency Market Insights (PRD Section 3.6) */}
      <MarketInsights rates={rates} locale={locale} />

      {/* 5. Bank Comparison Table & Historical Chart (PRD Section 3.3) */}
      <section className="grid gap-5 xl:grid-cols-[1fr_320px]">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="banks">{isEnglish ? "Banks" : "Банки"}</TabsTrigger>
            <TabsTrigger value="nbu">{copy.nbu}</TabsTrigger>
            <TabsTrigger value="exchange">{isEnglish ? "Exchange offices" : "Обмінники"}</TabsTrigger>
            <TabsTrigger value="crypto">{isEnglish ? "Crypto" : "Крипта"}</TabsTrigger>
            <TabsTrigger value="converter">{copy.navConverter}</TabsTrigger>
          </TabsList>

          <TabsContent value="banks">
            <div className="flex flex-col gap-5">
              <RatesTable rates={rates} updatedAt={updatedAt} locale={locale} sourceFilter="banks" />
              <Suspense
                fallback={
                  <Card>
                    <CardHeader>
                      <CardTitle>USD/UAH</CardTitle>
                      <CardDescription>{isEnglish ? "Loading chart..." : "Завантажуємо графік..."}</CardDescription>
                    </CardHeader>
                  </Card>
                }
              >
                <UsdHistoryChart locale={locale} />
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="nbu">
            <RatesTable rates={rates} updatedAt={updatedAt} locale={locale} sourceFilter="nbu" title={isEnglish ? "NBU official rates" : "Офіційний курс НБУ"} />
          </TabsContent>

          <TabsContent value="exchange">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? "Exchange offices" : "Обмінники"}</CardTitle>
                <CardDescription>{isEnglish ? "Verified exchange offices will be added after API integration." : "Сертифіковані пункти обміну будуть підключені після валідації API."}</CardDescription>
              </CardHeader>
              <CardContent><Badge variant="outline">{copy.noData}</Badge></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crypto">
            <Card>
              <CardHeader>
                <CardTitle>{isEnglish ? "Crypto (USDT/UAH)" : "Крипта (USDT/UAH)"}</CardTitle>
                <CardDescription>{isEnglish ? "Crypto market quotes are shown once authorized providers are attached." : "Криптовалютні котирування будуть увімкнені після підключення ліцензованого провайдера."}</CardDescription>
              </CardHeader>
              <CardContent><Badge variant="outline">{copy.noData}</Badge></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="converter">
            <Card>
              <CardHeader>
                <CardTitle>{copy.converter}</CardTitle>
                <CardDescription>{isEnglish ? "The smart converter is placed above for quick calculations." : "Розумний конвертер доступний вище на сторінці для швидкого розрахунку."}</CardDescription>
              </CardHeader>
              <CardContent>
                <a className="text-sm font-black text-cyan-700 dark:text-cyan-300 hover:underline" href="#converter">
                  {copy.converter} &uarr;
                </a>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sidebar Info & Trust */}
        <aside className="hidden flex-col gap-5 xl:flex">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-cyan-600">
                <ShieldCheck size={20} />
                <CardTitle className="text-base">{copy.trustTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-6 text-slate-600 dark:text-slate-300">
                {copy.trustBody}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-cyan-600">
                <Bot size={20} />
                <CardTitle className="text-base">{copy.aiTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-6 text-slate-600 dark:text-slate-300">
                {copy.aiBody}
              </p>
            </CardContent>
          </Card>

          <AdSlot slotId="ad-sidebar" locale={locale} />
        </aside>
      </section>

      {/* 6. Editorial Knowledge & Guide (PRD Section 5.4) */}
      <EditorialContent topic={topic} locale={locale} />

      {/* 7. Full FAQ */}
      <FullFAQ locale={locale} />
    </>
  );
};

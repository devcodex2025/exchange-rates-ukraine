import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, Bot, CheckCircle2, RefreshCw, ShieldCheck, AlertCircle, ArrowUpRight } from "lucide-react";
import { CurrencyCard } from "../components/CurrencyCard";
import { CurrencyConverter } from "../components/CurrencyConverter";
import { FullFAQ } from "../components/FullFAQ";
import { RatesTable } from "../components/RatesTable";
import { BestRateFinder } from "../components/BestRateFinder";
import { MarketInsights } from "../components/MarketInsights";
import { EditorialContent } from "../components/EditorialContent";
import { TaglineReveal } from "../components/TaglineReveal";
import { RatesSkeleton } from "../components/RatesSkeleton";
import { Toast } from "../components/ui/toast";
import { useScrollReveal } from "../lib/useScrollReveal";
import { AdSlot } from "../components/AdSlot";
import { CURRENCY_CODES, BANKS, Locale, UI_COPY } from "../constants";
import { formatDateTime, getSourceSummary, normalizeRates, RawRatesResponse } from "../lib/rates";
import { Badge } from "../components/ui/badge";
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
  locale,
}) => {
  const { pathname } = useLocation();
  const rates = useMemo(() => normalizeRates(data), [data]);
  const sources = useMemo(() => getSourceSummary(data), [data]);
  const updatedAt = data?.updatedAt || null;
  const copy = UI_COPY[locale];
  const isEnglish = locale === "en";

  const initialTab = useMemo(() => {
    if (pathname.includes("kurs-nbu")) return "nbu";
    if (pathname.includes("converter") || pathname.includes("konverter")) return "converter";
    return "banks";
  }, [pathname]);

  const [activeTab, setActiveTab] = useState(initialTab);
  useScrollReveal();

  // Toast open / close: confirm a manual refresh once the new data lands.
  const [toastOpen, setToastOpen] = useState(false);
  const wasLoading = useRef(loading);
  const hasLoadedOnce = useRef(false);

  useEffect(() => {
    const was = wasLoading.current;
    wasLoading.current = loading;

    if (!was || loading) return;

    if (hasLoadedOnce.current && !error) {
      setToastOpen(true);
      const timer = window.setTimeout(() => setToastOpen(false), 2600);
      return () => window.clearTimeout(timer);
    }

    hasLoadedOnce.current = true;
  }, [loading, error]);

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
      {/* Hero Section per rules B5, B7 · Ridge inspired editorial layout */}
      <section id="main-content" className="relative overflow-hidden pt-4 sm:pt-6">
        <div aria-hidden="true" className="hero-glow absolute inset-x-0 top-0 h-full" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <div className="hero-stagger max-w-[680px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-[#ADB7BE]">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
              {copy.eyebrow}
            </span>

            {/* Heading text gradient per B5 */}
            <h1 className="hero-gradient-text mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl sm:leading-tight sm:tracking-tighter">
              {isEnglish ? (
                <>
                  Find the Best Exchange Rate <br className="hidden sm:inline" />
                  Across Ukrainian Banks
                </>
              ) : (
                <>
                  Знайдіть найкращий курс валют <br className="hidden sm:inline" />
                  у банках України сьогодні
                </>
              )}
            </h1>

            <p className="mt-5 max-w-[640px] text-base leading-relaxed text-slate-500 dark:text-[#ADB7BE] sm:text-lg">
              {copy.heroSubtitle}
            </p>

            {/* Primary & Secondary Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#best-rates"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-brand-700 active:scale-[0.98] dark:bg-brand-500 dark:hover:bg-brand-400"
              >
                <span>{copy.navBest}</span>
                <ArrowRight size={16} />
              </a>
              <a
                href="#converter"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-slate-50 active:scale-[0.98] dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-slate-200 dark:hover:bg-[#2E2E2E]"
              >
                {copy.converter}
              </a>
            </div>

            {/* Editorial stats row, Ridge style: real numbers from the data layer */}
            <dl className="mt-10 flex items-stretch overflow-hidden border-y border-slate-200/80 dark:border-[#2E2E2E]">
              <div className="flex-1 py-4 pr-4">
                <dd className="font-mono text-2xl font-semibold tabular-nums text-slate-950 dark:text-white sm:text-3xl">
                  {BANKS.length}
                </dd>
                <dt className="mt-1 text-xs font-medium text-slate-500 dark:text-[#ADB7BE]">
                  {isEnglish ? "banks & the NBU tracked" : "банків та НБУ на моніторингу"}
                </dt>
              </div>
              <span aria-hidden="true" className="w-px bg-slate-200/80 dark:bg-[#2E2E2E]" />
              <div className="flex-1 px-4 py-4">
                <dd className="font-mono text-2xl font-semibold tabular-nums text-slate-950 dark:text-white sm:text-3xl">
                  {CURRENCY_CODES.length}
                </dd>
                <dt className="mt-1 text-xs font-medium text-slate-500 dark:text-[#ADB7BE]">
                  {isEnglish ? "currencies compared" : "валюти у порівнянні"}
                </dt>
              </div>
              <span aria-hidden="true" className="w-px bg-slate-200/80 dark:bg-[#2E2E2E]" />
              <div className="flex-1 py-4 pl-4">
                <dd className="font-mono text-2xl font-semibold tabular-nums text-slate-950 dark:text-white sm:text-3xl">
                  {isEnglish ? "24/7" : "24/7"}
                </dd>
                <dt className="mt-1 text-xs font-medium text-slate-500 dark:text-[#ADB7BE]">
                  {isEnglish ? "rates kept up to date" : "курси завжди актуальні"}
                </dt>
              </div>
            </dl>

            {/* Quick telemetry footer */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-[#ADB7BE]">
              <div className="flex items-center gap-2">
                <span>{copy.lastUpdate}:</span>
                <strong className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {formatDateTime(updatedAt, isEnglish ? "en-US" : "uk-UA")}
                </strong>
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={fetchData}
                className="inline-flex items-center gap-1.5 font-semibold text-brand-700 hover:underline active:scale-[0.98] disabled:opacity-50 dark:text-brand-300"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                <span>{copy.refresh}</span>
              </button>
            </div>
          </div>

          {/* Hero art in a calm framed tile */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-[0_24px_48px_-24px_rgba(15,23,42,0.25)] dark:border-[#2E2E2E]">
              <img
                src="/illustrations/hero-3d-fintech.jpg"
                srcSet="/illustrations/hero-3d-fintech-832.jpg 832w, /illustrations/hero-3d-fintech.jpg 1664w"
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 512px, 100vw"
                alt={isEnglish ? "Glass hryvnia coin surrounded by floating currency charts" : "Скляна монета гривні в оточенні валютних графіків"}
                width={1664}
                height={928}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-105"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Data sources strip per B8 transparency */}
      {!loading && rates.length > 0 ? (
        <section
          aria-label={isEnglish ? "Data sources" : "Джерела даних"}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-[#ADB7BE]"
        >
          <span className="font-semibold uppercase tracking-wider text-slate-700 dark:text-[#ADB7BE]">
            {isEnglish ? "Sources" : "Джерела"}
          </span>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {sources.map((source) => (
              <li
                key={source.id}
                className="t-tip-group relative inline-flex items-center gap-1.5"
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${source.ok ? "bg-emerald-500" : "bg-slate-300 dark:bg-[#2E2E2E]"}`}
                />
                <span>{source.name}</span>
                <span className="t-tip" role="tooltip">
                  {source.source}: {source.count} {isEnglish ? "rates" : "курсів"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="is-shaking flex flex-wrap items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <AlertCircle size={16} />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 px-3 py-1.5 caption-3 text-amber-900 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-amber-100 active:scale-[0.98] disabled:opacity-50 dark:border-amber-800 dark:text-amber-100 dark:hover:bg-amber-900/40"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            <span>{isEnglish ? "Try again" : "Спробувати ще раз"}</span>
          </button>
        </div>
      ) : null}

      {/* 1. Best Rate Finder */}
      {loading && rates.length === 0 ? (
        <RatesSkeleton label={isEnglish ? "Loading exchange rates" : "Завантаження курсів валют"} />
      ) : (
        <>
          <BestRateFinder rates={rates} locale={locale} />

          {/* 2. Key Currency Cards */}
          <section aria-label={isEnglish ? "Currency overview cards" : "Огляд курсів валют"} className="skel-content-enter grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CURRENCY_CODES.map((code) => (
              <CurrencyCard code={code} key={code} locale={locale} rates={rates} updatedAt={updatedAt} />
            ))}
          </section>
        </>
      )}

      {/* Mandatory Tagline Reveal Section per rule B11 */}
      <TaglineReveal locale={locale} />

      {/* Non-intrusive Ad Placement */}
      <AdSlot slotId="ad-top-banner" locale={locale} />

      {/* 3. Smart Currency Converter */}
      <CurrencyConverter rates={rates} locale={locale} />

      {/* 4. Currency Market Insights */}
      <MarketInsights rates={rates} locale={locale} />

      {/* 5. Bank Comparison Table & Historical Chart */}
      <section className="t-reveal grid min-w-0 gap-6 xl:grid-cols-[1fr_340px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="min-w-0">
          <TabsList className="bg-slate-100 p-1 dark:bg-[#202020] dark:border dark:border-[#2E2E2E]">
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
                  <Card className="rounded-2xl border border-slate-200 bg-white dark:border-[#2E2E2E] dark:bg-[#202020]">
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
            <Card className="rounded-2xl border border-slate-200 bg-white dark:border-[#2E2E2E] dark:bg-[#202020]">
              <CardHeader>
                <CardTitle>{isEnglish ? "Exchange offices" : "Обмінники"}</CardTitle>
                <CardDescription>{isEnglish ? "Verified exchange offices will be added after API integration." : "Сертифіковані пункти обміну будуть підключені після валідації API."}</CardDescription>
              </CardHeader>
              <CardContent><Badge variant="outline">{copy.noData}</Badge></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crypto">
            <Card className="rounded-2xl border border-slate-200 bg-white dark:border-[#2E2E2E] dark:bg-[#202020]">
              <CardHeader>
                <CardTitle>{isEnglish ? "Crypto (USDT/UAH)" : "Крипта (USDT/UAH)"}</CardTitle>
                <CardDescription>{isEnglish ? "Crypto market quotes are shown once authorized providers are attached." : "Криптовалютні котирування будуть увімкнені після підключення ліцензованого провайдера."}</CardDescription>
              </CardHeader>
              <CardContent><Badge variant="outline">{copy.noData}</Badge></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="converter">
            <Card className="rounded-2xl border border-slate-200 bg-white dark:border-[#2E2E2E] dark:bg-[#202020]">
              <CardHeader>
                <CardTitle>{copy.converter}</CardTitle>
                <CardDescription>{isEnglish ? "The smart converter is placed above for quick calculations." : "Розумний конвертер доступний вище на сторінці для швидкого розрахунку."}</CardDescription>
              </CardHeader>
              <CardContent>
                <a className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-400" href="#converter">
                  {copy.converter} &uarr;
                </a>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sidebar Info & Trust with 3D Shield Art */}
        <aside className="hidden flex-col gap-5 xl:flex">
          <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020]">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-[#2E2E2E]">
                <img
                  src="/illustrations/trust-shield-3d.jpg"
                  alt={isEnglish ? "Glass shield with a check mark" : "Скляний щит із позначкою перевірки"}
                  width={256}
                  height={256}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <CardTitle className="text-base font-semibold">{copy.trustTitle}</CardTitle>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-[#ADB7BE]">
              {copy.trustBody}
            </p>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020]">
            <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
              <Bot size={20} />
              <CardTitle className="text-base font-semibold">{copy.aiTitle}</CardTitle>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-[#ADB7BE]">
              {copy.aiBody}
            </p>
          </Card>

          <AdSlot slotId="ad-sidebar" locale={locale} />
        </aside>
      </section>

      {/* 6. Editorial Knowledge & Guide */}
      <EditorialContent topic={topic} locale={locale} />

      {/* 7. Full FAQ */}
      <FullFAQ locale={locale} />

      <Toast open={toastOpen} message={isEnglish ? "Rates updated" : "Курси оновлено"} />
    </>
  );
};

import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Sparkles, Landmark } from "lucide-react";
import { CURRENCY_CODES, Locale, UI_COPY } from "../constants";
import { formatRate, getBestRates, NormalizedRate } from "../lib/rates";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

interface BestRateFinderProps {
  rates: NormalizedRate[];
  locale: Locale;
  onSelectRate?: (currency: string, bankId: string, action: "buy" | "sell") => void;
}

export const BestRateFinder: React.FC<BestRateFinderProps> = ({ rates, locale }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const isEnglish = locale === "en";
  const copy = UI_COPY[locale];

  const { bestBuy, bestSell } = getBestRates(rates, selectedCurrency);
  const nbuRate = rates.find((r) => r.code === selectedCurrency && r.bankId === "nbu")?.buy ?? null;

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-[#272727] dark:bg-[#181818] sm:p-4" id="best-rates">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-[#313131]">
              <img
                src="/illustrations/best-rate-finder-3d.jpg"
                alt={isEnglish ? "Magnifying glass over coins with a rising arrow" : "Лупа над монетами зі стрілкою вгору"}
                width={256}
                height={256}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {copy.bestRateFinderTitle}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
                {copy.bestRateFinderSubtitle}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Currencies">
            {CURRENCY_CODES.map((code) => {
              const active = selectedCurrency === code;
              return (
                <button
                  key={code}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCurrency(code)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#272727] dark:text-slate-300 dark:hover:bg-[#313131]"
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Best bank to BUY from */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-[#272727] dark:bg-[#1F1F1F]">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <ArrowDownLeft className="text-emerald-700 dark:text-emerald-400" size={16} />
                  {copy.bestToBuyTitle} ({selectedCurrency})
                </span>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                  {isEnglish ? "Lowest price" : "Мінімальна ціна"}
                </Badge>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
                  {formatRate(bestSell?.sell)}
                </span>
                <span className="font-mono text-sm font-medium text-slate-500">UAH</span>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {copy.whereToBuy}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-[#313131]">
              <div className="flex items-center gap-2">
                {bestSell?.bankLogo ? (
                  <img
                    src={bestSell.bankLogo}
                    alt={bestSell.bankName}
                    className="h-6 w-6 rounded object-contain"
                    loading="lazy"
                  />
                ) : (
                  <Landmark size={18} className="text-slate-400" />
                )}
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {bestSell?.bankName || copy.noData}
                </span>
              </div>

              {nbuRate && bestSell?.sell ? (
                <span className="font-mono text-xs font-medium text-slate-500">
                  {bestSell.sell >= nbuRate ? "+" : ""}
                  {(bestSell.sell - nbuRate).toFixed(2)} vs НБУ
                </span>
              ) : null}
            </div>
          </div>

          {/* Best bank to SELL to */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-[#272727] dark:bg-[#1F1F1F]">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  <ArrowUpRight className="text-cyan-700 dark:text-cyan-400" size={16} />
                  {copy.bestToSellTitle} ({selectedCurrency})
                </span>
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-700 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/30">
                  {isEnglish ? "Highest price" : "Максимальна ціна"}
                </Badge>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold text-slate-950 dark:text-white sm:text-4xl">
                  {formatRate(bestBuy?.buy)}
                </span>
                <span className="font-mono text-sm font-medium text-slate-500">UAH</span>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {copy.whereToSell}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-[#313131]">
              <div className="flex items-center gap-2">
                {bestBuy?.bankLogo ? (
                  <img
                    src={bestBuy.bankLogo}
                    alt={bestBuy.bankName}
                    className="h-6 w-6 rounded object-contain"
                    loading="lazy"
                  />
                ) : (
                  <Landmark size={18} className="text-slate-400" />
                )}
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {bestBuy?.bankName || copy.noData}
                </span>
              </div>

              {nbuRate && bestBuy?.buy ? (
                <span className="font-mono text-xs font-medium text-slate-500">
                  {bestBuy.buy >= nbuRate ? "+" : ""}
                  {(bestBuy.buy - nbuRate).toFixed(2)} vs НБУ
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {nbuRate ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {isEnglish ? "Official NBU reference:" : "Офіційний курс НБУ:"}{" "}
              <strong className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                {formatRate(nbuRate)} UAH
              </strong>
            </span>
            <a
              href="#converter"
              className="font-medium text-cyan-700 hover:underline dark:text-cyan-400"
            >
              {copy.converter} &rarr;
            </a>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

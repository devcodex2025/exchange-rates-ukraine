import React, { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Sparkles, TrendingUp, Landmark } from "lucide-react";
import { CURRENCY_CODES, CURRENCY_NAMES, Locale, UI_COPY } from "../constants";
import { formatRate, getBestRates, NormalizedRate } from "../lib/rates";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

interface BestRateFinderProps {
  rates: NormalizedRate[];
  locale: Locale;
  onSelectRate?: (currency: string, bankId: string, action: "buy" | "sell") => void;
}

export const BestRateFinder: React.FC<BestRateFinderProps> = ({ rates, locale, onSelectRate }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const isEnglish = locale === "en";
  const copy = UI_COPY[locale];

  const { bestBuy, bestSell } = getBestRates(rates, selectedCurrency);
  const nbuRate = rates.find((r) => r.code === selectedCurrency && r.bankId === "nbu")?.buy ?? null;

  return (
    <Card className="border-slate-200 shadow-sm dark:border-slate-800" id="best-rates">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-600/10 p-2.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <Sparkles size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-black text-slate-950 dark:text-white sm:text-xl">
                {copy.bestRateFinderTitle}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {copy.bestRateFinderSubtitle}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Currencies">
            {CURRENCY_CODES.map((code) => {
              const active = selectedCurrency === code;
              return (
                <button
                  key={code}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCurrency(code)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-black transition ${
                    active
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {code}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Best bank to BUY from (customer pays lowest sell rate) */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <ArrowDownLeft className="text-emerald-600 dark:text-emerald-400" size={16} />
                  {copy.bestToBuyTitle} ({selectedCurrency})
                </span>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30">
                  {isEnglish ? "Lowest price" : "Мінімальна ціна"}
                </Badge>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-black text-slate-950 dark:text-white">
                  {formatRate(bestSell?.sell)}
                </span>
                <span className="text-sm font-bold text-slate-500">UAH</span>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {copy.whereToBuy}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-slate-800">
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
                <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {bestSell?.bankName || copy.noData}
                </span>
              </div>

              {nbuRate && bestSell?.sell ? (
                <span className="text-xs font-semibold text-slate-500">
                  {bestSell.sell >= nbuRate ? "+" : ""}
                  {(bestSell.sell - nbuRate).toFixed(2)} до НБУ
                </span>
              ) : null}
            </div>
          </div>

          {/* Best bank to SELL to (customer gets highest buy rate) */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <ArrowUpRight className="text-cyan-600 dark:text-cyan-400" size={16} />
                  {copy.bestToSellTitle} ({selectedCurrency})
                </span>
                <Badge variant="outline" className="border-cyan-500/30 text-cyan-700 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/30">
                  {isEnglish ? "Highest price" : "Максимальна ціна"}
                </Badge>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-black text-slate-950 dark:text-white">
                  {formatRate(bestBuy?.buy)}
                </span>
                <span className="text-sm font-bold text-slate-500">UAH</span>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {copy.whereToSell}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 dark:border-slate-800">
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
                <span className="text-sm font-black text-slate-900 dark:text-slate-100">
                  {bestBuy?.bankName || copy.noData}
                </span>
              </div>

              {nbuRate && bestBuy?.buy ? (
                <span className="text-xs font-semibold text-slate-500">
                  {bestBuy.buy >= nbuRate ? "+" : ""}
                  {(bestBuy.buy - nbuRate).toFixed(2)} до НБУ
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Official NBU footnote */}
        {nbuRate ? (
          <div className="mt-3 flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {isEnglish ? "Official NBU reference:" : "Офіційний курс НБУ:"}{" "}
              <strong className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {formatRate(nbuRate)} UAH
              </strong>
            </span>
            <a
              href="#converter"
              className="font-bold text-cyan-600 hover:underline dark:text-cyan-400"
            >
              {copy.converter} &rarr;
            </a>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
};

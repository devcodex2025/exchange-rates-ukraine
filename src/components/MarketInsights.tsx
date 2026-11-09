import React, { useState } from "react";
import { BarChart3, HelpCircle, Info, Percent, TrendingDown, TrendingUp } from "lucide-react";
import { CURRENCY_CODES, CURRENCY_NAMES, Locale, UI_COPY } from "../constants";
import { formatRate, getMarketInsights, NormalizedRate } from "../lib/rates";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

interface MarketInsightsProps {
  rates: NormalizedRate[];
  locale: Locale;
}

export const MarketInsights: React.FC<MarketInsightsProps> = ({ rates, locale }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const isEnglish = locale === "en";
  const copy = UI_COPY[locale];

  const insights = getMarketInsights(rates, selectedCurrency);

  return (
    <Card className="border-slate-200 shadow-sm dark:border-slate-800" id="market-insights">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-600/10 p-2.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <BarChart3 size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-black text-slate-950 dark:text-white sm:text-xl">
                {copy.insightsTitle}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {copy.insightsSubtitle}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Insight currencies">
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Metric 1: NBU vs Bank Spread */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isEnglish ? "Official NBU rate" : "Офіційний курс НБУ"}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-black text-slate-950 dark:text-white">
                {formatRate(insights.nbuRate)}
              </span>
              <span className="text-xs font-bold text-slate-400">UAH</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEnglish ? "National bank benchmark" : "Базовий орієнтир ринку"}
            </p>
          </div>

          {/* Metric 2: Best Available Spread */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isEnglish ? "Minimum market spread" : "Мінімальний спред"}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-black text-slate-950 dark:text-white">
                {insights.bestSpread !== null ? `${insights.bestSpread.toFixed(2)}` : "—"}
              </span>
              <span className="text-xs font-bold text-slate-400">UAH</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEnglish ? "Difference between best sell and buy" : "Різниця кращого продажу і купівлі"}
            </p>
          </div>

          {/* Metric 3: Bank buy dispersion */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isEnglish ? "Bank buy range" : "Діапазон купівлі банків"}
            </span>
            <div className="mt-2 flex items-baseline gap-1 font-mono text-base font-black text-slate-950 dark:text-white">
              <span>{formatRate(insights.worstBuyRate)}</span>
              <span className="text-slate-400 font-normal">...</span>
              <span>{formatRate(insights.bestBuyRate)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEnglish
                ? `Variance: ${((insights.bestBuyRate ?? 0) - (insights.worstBuyRate ?? 0)).toFixed(2)} UAH`
                : `Коливання: ${((insights.bestBuyRate ?? 0) - (insights.worstBuyRate ?? 0)).toFixed(2)} грн`}
            </p>
          </div>

          {/* Metric 4: Bank sell dispersion */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {isEnglish ? "Bank sell range" : "Діапазон продажу банків"}
            </span>
            <div className="mt-2 flex items-baseline gap-1 font-mono text-base font-black text-slate-950 dark:text-white">
              <span>{formatRate(insights.bestSellRate)}</span>
              <span className="text-slate-400 font-normal">...</span>
              <span>{formatRate(insights.worstSellRate)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEnglish
                ? `Variance: ${((insights.worstSellRate ?? 0) - (insights.bestSellRate ?? 0)).toFixed(2)} UAH`
                : `Коливання: ${((insights.worstSellRate ?? 0) - (insights.bestSellRate ?? 0)).toFixed(2)} грн`}
            </p>
          </div>
        </div>

        {/* Short educational market definition box */}
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 text-xs text-slate-700 dark:border-blue-950/40 dark:bg-blue-950/20 dark:text-slate-300">
          <div className="flex items-start gap-2.5">
            <Info size={16} className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <strong className="font-bold text-slate-900 dark:text-white">
                {isEnglish ? "How to interpret market spread:" : "Як рахується вигода від спреду:"}
              </strong>{" "}
              {isEnglish
                ? "The narrower the gap between the buying and selling rates, the lower the implicit fee charged by banks. Checking the Best Rate Finder allows you to save on currency exchanges by finding institutions with the tightest margin."
                : "Чим менша різниця (спред) між курсом купівлі та продажу, тим менше коштів ви втрачаєте на конвертації. Використовуйте блок «Кращий курс», щоб обмінювати валюту за найвигіднішими цінами в Україні."}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

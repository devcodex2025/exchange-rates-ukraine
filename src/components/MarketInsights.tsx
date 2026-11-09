import React, { useState } from "react";
import { BarChart3, Info } from "lucide-react";
import { CURRENCY_CODES, Locale, UI_COPY } from "../constants";
import { formatRate, getMarketInsights, NormalizedRate } from "../lib/rates";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";

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
    <Card className="t-reveal rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020] sm:p-4" id="market-insights">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-brand-50 text-brand-600 dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-brand-300">
              <BarChart3 size={20} />
            </div>
            <div>
              <p className="eyebrow">{isEnglish ? "Market pulse" : "Пульс ринку"}</p>
              <CardTitle className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {copy.insightsTitle}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-[#ADB7BE] sm:text-sm">
                {copy.insightsSubtitle}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Insight currencies">
            {CURRENCY_CODES.map((code) => {
              const active = selectedCurrency === code;
              return (
                <button
                  key={code}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCurrency(code)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    active
                      ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-[#2E2E2E] dark:text-[#ADB7BE] dark:hover:bg-[#2E2E2E]"
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Metric 1 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]">
            <span className="text-xs font-medium text-slate-500 dark:text-[#ADB7BE]">
              {isEnglish ? "Official NBU rate" : "Офіційний курс НБУ"}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold text-slate-950 dark:text-white">
                {formatRate(insights.nbuRate)}
              </span>
              <span className="font-mono text-xs text-slate-400">UAH</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEnglish ? "National bank benchmark" : "Базовий орієнтир ринку"}
            </p>
          </div>

          {/* Metric 2 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]">
            <span className="text-xs font-medium text-slate-500 dark:text-[#ADB7BE]">
              {isEnglish ? "Minimum market spread" : "Мінімальний спред"}
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold text-slate-950 dark:text-white">
                {insights.bestSpread !== null ? `${insights.bestSpread.toFixed(2)}` : "—"}
              </span>
              <span className="font-mono text-xs text-slate-400">UAH</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEnglish ? "Difference between best sell and buy" : "Різниця кращого продажу і купівлі"}
            </p>
          </div>

          {/* Metric 3 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]">
            <span className="text-xs font-medium text-slate-500 dark:text-[#ADB7BE]">
              {isEnglish ? "Bank buy range" : "Діапазон купівлі банків"}
            </span>
            <div className="mt-2 flex items-baseline gap-1 font-mono text-sm font-semibold text-slate-950 dark:text-white">
              <span>{formatRate(insights.worstBuyRate)}</span>
              <span className="font-normal text-slate-400">...</span>
              <span>{formatRate(insights.bestBuyRate)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEnglish
                ? `Variance: ${((insights.bestBuyRate ?? 0) - (insights.worstBuyRate ?? 0)).toFixed(2)} UAH`
                : `Коливання: ${((insights.bestBuyRate ?? 0) - (insights.worstBuyRate ?? 0)).toFixed(2)} грн`}
            </p>
          </div>

          {/* Metric 4 */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]">
            <span className="text-xs font-medium text-slate-500 dark:text-[#ADB7BE]">
              {isEnglish ? "Bank sell range" : "Діапазон продажу банків"}
            </span>
            <div className="mt-2 flex items-baseline gap-1 font-mono text-sm font-semibold text-slate-950 dark:text-white">
              <span>{formatRate(insights.bestSellRate)}</span>
              <span className="font-normal text-slate-400">...</span>
              <span>{formatRate(insights.worstSellRate)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isEnglish
                ? `Variance: ${((insights.worstSellRate ?? 0) - (insights.bestSellRate ?? 0)).toFixed(2)} UAH`
                : `Коливання: ${((insights.worstSellRate ?? 0) - (insights.bestSellRate ?? 0)).toFixed(2)} грн`}
            </p>
          </div>
        </div>

        {/* Informational callout */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-[#ADB7BE]">
          <div className="flex items-start gap-2.5">
            <Info size={16} className="mt-0.5 shrink-0 text-brand-700 dark:text-brand-400" />
            <div>
              <strong className="font-semibold text-slate-900 dark:text-white">
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

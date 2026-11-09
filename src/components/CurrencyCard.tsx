import React from "react";
import { ArrowDown, ArrowUp, Minus, TrendingUp } from "lucide-react";
import { BANKS, CURRENCY_NAMES, Locale, UI_COPY } from "../constants";
import { formatRate, getBestRates, NormalizedRate } from "../lib/rates";
import { SubtleNumber } from "./ui/subtle-number";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface CurrencyCardProps {
  code: string;
  rates: NormalizedRate[];
  locale: Locale;
  updatedAt?: string | null;
}

export const CurrencyCard: React.FC<CurrencyCardProps> = ({ code, rates, locale }) => {
  const { bestBuy, bestSell } = getBestRates(rates, code);
  const nbu = rates.find((rate) => rate.code === code && rate.bankId === "nbu")?.nbu ?? null;
  const bank = BANKS.find((item) => item.id === bestSell?.bankId || item.id === bestBuy?.bankId);
  const currency = CURRENCY_NAMES[code];
  const copy = UI_COPY[locale];
  const spread = bestBuy?.buy && bestSell?.sell ? bestSell.sell - bestBuy.buy : null;

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] dark:border-[#313131] dark:bg-[#1F1F1F]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="font-mono text-xl font-semibold">{code}</CardTitle>
              <Badge variant="secondary" className="font-mono text-xs font-semibold">{currency?.symbol}</Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{currency?.[locale] || code}</p>
          </div>
          {bank?.logo ? (
            <img className="h-7 max-w-16 object-contain" src={bank.logo} alt={bank.name} loading="lazy" />
          ) : (
            <TrendingUp className="text-brand-700 dark:text-brand-400" size={20} />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <dl className="grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-emerald-500/10 bg-emerald-50/50 p-2.5 dark:border-emerald-500/20 dark:bg-emerald-950/20">
            <dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <ArrowUp size={11} /> {copy.buy}
            </dt>
            <dd className="mt-1 font-mono text-xl font-semibold text-slate-950 dark:text-white">
              <SubtleNumber value={bestBuy?.buy} />
            </dd>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-300">
              {bestBuy?.bankName || copy.noData}
            </p>
          </div>

          <div className="rounded-xl border border-brand-500/10 bg-brand-50/50 p-2.5 dark:border-brand-500/20 dark:bg-brand-950/20">
            <dt className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
              <ArrowDown size={11} /> {copy.sell}
            </dt>
            <dd className="mt-1 font-mono text-xl font-semibold text-slate-950 dark:text-white">
              <SubtleNumber value={bestSell?.sell} />
            </dd>
            <p className="mt-0.5 truncate text-xs font-medium text-slate-500 dark:text-slate-300">
              {bestSell?.bankName || copy.noData}
            </p>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="justify-between border-t border-slate-100 pt-3 text-xs dark:border-[#313131]">
        <span className="font-mono text-xs font-medium text-slate-500 dark:text-slate-300">
          {copy.nbu} <SubtleNumber value={nbu} />
        </span>
        {bestSell || bestBuy ? (
          <Badge variant="outline" className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            {locale === "en" ? "Top rate" : "Топ курс"}
          </Badge>
        ) : (
          <span className="flex items-center gap-1 font-mono text-xs text-slate-500">
            <Minus size={11} /> {copy.spread} {formatRate(spread)}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

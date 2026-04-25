import React from "react";
import { ArrowDown, ArrowUp, Minus, TrendingUp } from "lucide-react";
import { BANKS, CURRENCY_NAMES, Locale, UI_COPY } from "../constants";
import { formatRate, getBestRates, NormalizedRate } from "../lib/rates";

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
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xl font-black text-slate-950 dark:text-white">{code}</span>
            <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-bold text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
              {currency?.symbol}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{currency?.[locale] || code}</p>
        </div>
        {bank?.logo ? (
          <img className="h-8 max-w-20 object-contain" src={bank.logo} alt={bank.name} loading="lazy" />
        ) : (
          <TrendingUp className="text-cyan-600" size={22} />
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-cyan-50 p-3 dark:bg-cyan-950/30">
          <dt className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-cyan-700 dark:text-cyan-300">
            <ArrowUp size={12} /> {copy.buy}
          </dt>
          <dd className="mt-1 font-mono text-2xl font-black text-slate-950 dark:text-white">{formatRate(bestBuy?.buy)}</dd>
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{bestBuy?.bankName || copy.noData}</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
          <dt className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-300">
            <ArrowDown size={12} /> {copy.sell}
          </dt>
          <dd className="mt-1 font-mono text-2xl font-black text-slate-950 dark:text-white">{formatRate(bestSell?.sell)}</dd>
          <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{bestSell?.bankName || copy.noData}</p>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
        <span className="font-semibold text-slate-500 dark:text-slate-400">{copy.nbu} {formatRate(nbu)}</span>
        <span className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300">
          <Minus size={12} /> {copy.spread} {formatRate(spread)}
        </span>
      </div>
    </section>
  );
};

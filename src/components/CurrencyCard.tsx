import React from "react";
import { ArrowDown, ArrowUp, Minus, TrendingUp } from "lucide-react";
import { BANKS, CURRENCY_NAMES, Locale, UI_COPY } from "../constants";
import { formatRate, getBestRates, NormalizedRate } from "../lib/rates";
import { PopNumber } from "./ui/pop-number";
import { BankLogo } from "./ui/bank-logo";
import { Badge } from "./ui/badge";
import { CurrencyGlyph, hasCurrencyGlyph } from "./ui/currency-glyph";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

// Full bank names ("Oschadbank", "Raiffeisen Bank") overflow the buy/sell cells
// of the 230px-wide cards in the lg 5-col grid; shortNames are cell-safe.
const SHORT_BY_BANK_ID: Record<string, string> = Object.fromEntries(
  BANKS.map((bank) => [bank.id, bank.shortName] as [string, string]),
);

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
    <Card className="rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_rgba(15,23,42,0.12)] active:scale-[0.99] dark:border-[#2E2E2E] dark:bg-[#202020]">
      <CardHeader className="px-4 pb-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-[10px] border border-slate-200/80 bg-slate-50 font-mono text-sm font-semibold text-slate-700 dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-slate-200"
            >
              {hasCurrencyGlyph(code) ? <CurrencyGlyph code={code} size={17} /> : currency?.symbol || code}
            </span>
            <div className="min-w-0">
              <CardTitle className="title-3 text-slate-950 dark:text-white">{code}</CardTitle>
              <p className="text-xs text-slate-500 dark:text-[#ADB7BE]">{currency?.[locale] || code}</p>
            </div>
          </div>
          {bank?.logo ? (
            <BankLogo src={bank.logo} alt={bank.name} className="h-6 max-w-14 shrink-0 object-contain sm:h-7 sm:max-w-16" />
          ) : (
            <TrendingUp className="text-brand-600 dark:text-brand-300" size={18} />
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 pt-0">
        <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200/80 dark:border-[#2E2E2E]">
          <div className="col-span-1 border-r border-slate-200/80 bg-slate-50/70 p-3 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]/60">
            <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <ArrowUp size={11} /> {copy.buy}
            </dt>
            <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-950 dark:text-white">
              <PopNumber value={bestBuy?.buy} />
            </dd>
            <p
              className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-[#ADB7BE]"
              title={bestBuy?.bankName ?? undefined}
            >
              {(bestBuy && (SHORT_BY_BANK_ID[bestBuy.bankId] ?? bestBuy.bankName)) || copy.noData}
            </p>
          </div>

          <div className="col-span-1 bg-slate-50/70 p-3 dark:bg-[#2A2A2A]/60">
            <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300">
              <ArrowDown size={11} /> {copy.sell}
            </dt>
            <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-950 dark:text-white">
              <PopNumber value={bestSell?.sell} />
            </dd>
            <p
              className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-[#ADB7BE]"
              title={bestSell?.bankName ?? undefined}
            >
              {(bestSell && (SHORT_BY_BANK_ID[bestSell.bankId] ?? bestSell.bankName)) || copy.noData}
            </p>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="flex-wrap justify-between gap-x-2 gap-y-1 border-t border-slate-100 px-4 pb-3 pt-2.5 text-xs dark:border-[#2E2E2E]">
        <span className="min-w-0 truncate font-mono text-xs font-medium text-slate-500 dark:text-[#ADB7BE]">
          {copy.nbu} <PopNumber value={nbu} />
        </span>
        {bestSell || bestBuy ? (
          <Badge variant="outline" className="gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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

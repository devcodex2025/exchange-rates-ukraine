import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { CURRENCY_NAMES, Locale, UI_COPY } from "../constants";
import { bankLogos, formatDateTime, formatRate, getBestRates, NormalizedRate } from "../lib/rates";

interface RatesTableProps {
  rates: NormalizedRate[];
  updatedAt?: string | null;
  locale: Locale;
}

export const RatesTable: React.FC<RatesTableProps> = ({ rates, updatedAt, locale }) => {
  const [currency, setCurrency] = useState("USD");
  const [query, setQuery] = useState("");
  const isEnglish = locale === "en";
  const copy = UI_COPY[locale];
  const { bestBuy, bestSell } = getBestRates(rates, currency);

  const rows = useMemo(() => {
    return rates
      .filter((rate) => rate.code === currency)
      .filter((rate) => rate.bankName.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (a.bankId === "nbu") return 1;
        if (b.bankId === "nbu") return -1;
        return (b.buy ?? 0) - (a.buy ?? 0);
      });
  }, [currency, query, rates]);

  return (
    <section id="rates-table" className="rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">
            {copy.ratesTableTitle}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {copy.ratesTableSubtitle}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950"
              placeholder={copy.searchBank}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <select
            className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950"
            value={currency}
            onChange={(event) => setCurrency(event.target.value)}
          >
            {["USD", "EUR", "PLN", "GBP"].map((code) => (
              <option key={code} value={code}>
                {code} - {isEnglish ? CURRENCY_NAMES[code]?.en : CURRENCY_NAMES[code]?.uk}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <caption className="sr-only">{copy.ratesTableTitle}</caption>
          <thead className="sticky top-0 bg-white text-[11px] uppercase tracking-widest text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3">{copy.tableBank}</th>
              <th className="px-5 py-3">{copy.tableCurrency}</th>
              <th className="px-5 py-3 text-right">{copy.buy}</th>
              <th className="px-5 py-3 text-right">{copy.sell}</th>
              <th className="px-5 py-3 text-right">{copy.nbu}</th>
              <th className="px-5 py-3">{copy.tableStatus}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((rate) => (
              <tr key={`${rate.bankId}-${rate.code}`} className="text-sm">
                <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100">
                  <span className="flex items-center gap-3">
                    {bankLogos.get(rate.bankId) ? (
                      <img className="h-7 w-16 object-contain" src={bankLogos.get(rate.bankId)} alt={rate.bankName} loading="lazy" />
                    ) : null}
                    {rate.bankName}
                  </span>
                </td>
                <td className="px-5 py-4 font-mono font-black">{rate.code}/UAH</td>
                <td className="px-5 py-4 text-right font-mono font-black">{formatRate(rate.buy)}</td>
                <td className="px-5 py-4 text-right font-mono font-black">{formatRate(rate.sell)}</td>
                <td className="px-5 py-4 text-right font-mono">{formatRate(rate.nbu)}</td>
                <td className="px-5 py-4">
                  {rate.bankId === bestBuy?.bankId ? (
                    <span className="rounded-md bg-cyan-100 px-2 py-1 text-[11px] font-black uppercase text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
                      {copy.bestBuy}
                    </span>
                  ) : rate.bankId === bestSell?.bankId ? (
                    <span className="rounded-md bg-amber-100 px-2 py-1 text-[11px] font-black uppercase text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      {copy.bestSell}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">{copy.updated} {formatDateTime(updatedAt, isEnglish ? "en-US" : "uk-UA")}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

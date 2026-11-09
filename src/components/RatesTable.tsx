import React, { useMemo, useState } from "react";
import { ArrowDownUp, Search } from "lucide-react";
import { CURRENCY_CODES, CURRENCY_NAMES, Locale, UI_COPY } from "../constants";
import { bankLogos, formatDateTime, formatRate, getBestRates, NormalizedRate } from "../lib/rates";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface RatesTableProps {
  rates: NormalizedRate[];
  updatedAt?: string | null;
  locale: Locale;
  sourceFilter?: "all" | "banks" | "nbu";
  title?: string;
}

export const RatesTable: React.FC<RatesTableProps> = ({ rates, updatedAt, locale, sourceFilter = "all", title }) => {
  const [currency, setCurrency] = useState("USD");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"buy" | "sell" | "updated">("buy");
  const isEnglish = locale === "en";
  const copy = UI_COPY[locale];
  const { bestBuy, bestSell } = getBestRates(rates, currency);

  const rows = useMemo(() => {
    return rates
      .filter((rate) => rate.code === currency)
      .filter((rate) => (sourceFilter === "banks" ? rate.bankId !== "nbu" : sourceFilter === "nbu" ? rate.bankId === "nbu" : true))
      .filter((rate) => rate.bankName.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => {
        if (a.bankId === "nbu") return 1;
        if (b.bankId === "nbu") return -1;
        if (sortBy === "sell") return (a.sell ?? Infinity) - (b.sell ?? Infinity);
        if (sortBy === "updated") return (new Date(b.updatedAt || 0).getTime()) - (new Date(a.updatedAt || 0).getTime());
        return (b.buy ?? 0) - (a.buy ?? 0);
      });
  }, [currency, query, rates, sortBy, sourceFilter]);

  return (
    <Card id="rates-table" className="t-reveal min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#313131] dark:bg-[#1F1F1F]">
      <CardHeader className="border-b border-slate-200 p-5 dark:border-[#313131] sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight">{title || copy.ratesTableTitle}</CardTitle>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300 sm:text-sm">
              {copy.ratesTableSubtitle}
            </p>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-3">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-medium outline-none ring-brand-500/20 focus:ring-4 dark:border-[#313131] dark:bg-[#272727] dark:text-white"
                placeholder={copy.searchBank}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <select
              className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold outline-none ring-brand-500/20 focus:ring-4 dark:border-[#313131] dark:bg-[#272727] dark:text-white"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
            >
              {CURRENCY_CODES.map((code) => (
                <option key={code} value={code}>
                  {code} — {isEnglish ? CURRENCY_NAMES[code]?.en : CURRENCY_NAMES[code]?.uk}
                </option>
              ))}
            </select>
            <button
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold transition hover:bg-slate-100 active:scale-[0.98] dark:border-[#313131] dark:bg-[#272727] dark:hover:bg-[#313131]"
              onClick={() => setSortBy(sortBy === "buy" ? "sell" : sortBy === "sell" ? "updated" : "buy")}
              type="button"
            >
              <ArrowDownUp size={13} />
              <span>{sortBy === "buy" ? copy.bestBuy : sortBy === "sell" ? copy.bestSell : copy.updated}</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[760px]">
            <caption className="sr-only">{copy.ratesTableTitle}</caption>
            <TableHeader className="sticky top-0 bg-slate-50 dark:bg-[#272727]">
              <TableRow className="border-b border-slate-200 dark:border-[#313131]">
                <TableHead>{copy.tableBank}</TableHead>
                <TableHead>{copy.tableCurrency}</TableHead>
                <TableHead className="text-right">{copy.buy}</TableHead>
                <TableHead className="text-right">{copy.sell}</TableHead>
                <TableHead className="text-right">{copy.nbu}</TableHead>
                <TableHead>{copy.updated}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((rate) => (
                <TableRow key={`${rate.bankId}-${rate.code}`} className="border-b border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-[#313131] dark:hover:bg-[#272727]/60">
                  <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                    <span className="flex items-center gap-3">
                      {bankLogos.get(rate.bankId) ? (
                        <img className="h-6 w-14 object-contain" src={bankLogos.get(rate.bankId)} alt={rate.bankName} loading="lazy" />
                      ) : null}
                      <span>{rate.bankName}</span>
                    </span>
                  </TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{rate.code}/UAH</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">{formatRate(rate.buy)}</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">{formatRate(rate.sell)}</TableCell>
                  <TableCell className="text-right font-mono text-xs text-slate-500">{formatRate(rate.nbu)}</TableCell>
                  <TableCell>
                    {rate.bankId === bestBuy?.bankId ? (
                      <Badge variant="outline" className="border-emerald-500/40 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {copy.bestBuy}
                      </Badge>
                    ) : rate.bankId === bestSell?.bankId ? (
                      <Badge variant="outline" className="border-brand-500/40 text-xs font-semibold text-brand-700 dark:text-brand-400">
                        {copy.bestSell}
                      </Badge>
                    ) : (
                      <span className="font-mono text-xs text-slate-400">
                        {formatDateTime(rate.updatedAt || updatedAt, isEnglish ? "en-US" : "uk-UA")}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

import React, { useMemo, useState } from "react";
import { ArrowDownUp, Search } from "lucide-react";
import { CURRENCY_NAMES, Locale, UI_COPY } from "../constants";
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
    <Card id="rates-table">
      <CardHeader className="border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <CardTitle>{title || copy.ratesTableTitle}</CardTitle>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {copy.ratesTableSubtitle}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
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
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black outline-none transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900"
            onClick={() => setSortBy(sortBy === "buy" ? "sell" : sortBy === "sell" ? "updated" : "buy")}
            type="button"
          >
            <ArrowDownUp size={15} />
            {sortBy === "buy" ? copy.bestBuy : sortBy === "sell" ? copy.bestSell : copy.updated}
          </button>
        </div>
      </div>
      </CardHeader>

      <CardContent className="p-0">
      <div className="overflow-x-auto">
        <Table className="min-w-[760px]">
          <caption className="sr-only">{copy.ratesTableTitle}</caption>
          <TableHeader className="sticky top-0 bg-white dark:bg-slate-950">
            <TableRow>
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
              <TableRow key={`${rate.bankId}-${rate.code}`}>
                <TableCell className="font-bold text-slate-900 dark:text-slate-100">
                  <span className="flex items-center gap-3">
                    {bankLogos.get(rate.bankId) ? (
                      <img className="h-7 w-16 object-contain" src={bankLogos.get(rate.bankId)} alt={rate.bankName} loading="lazy" />
                    ) : null}
                    {rate.bankName}
                  </span>
                </TableCell>
                <TableCell className="font-mono font-black">{rate.code}/UAH</TableCell>
                <TableCell className="text-right font-mono font-black">{formatRate(rate.buy)}</TableCell>
                <TableCell className="text-right font-mono font-black">{formatRate(rate.sell)}</TableCell>
                <TableCell className="text-right font-mono">{formatRate(rate.nbu)}</TableCell>
                <TableCell>
                  {rate.bankId === bestBuy?.bankId ? (
                    <Badge variant="secondary">{copy.bestBuy}</Badge>
                  ) : rate.bankId === bestSell?.bankId ? (
                    <Badge variant="secondary">{copy.bestSell}</Badge>
                  ) : (
                    <span className="text-xs text-slate-400">{formatDateTime(rate.updatedAt || updatedAt, isEnglish ? "en-US" : "uk-UA")}</span>
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

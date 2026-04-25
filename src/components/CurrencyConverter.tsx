import React, { useMemo, useState } from "react";
import { ArrowDownRight, ArrowRightLeft, ArrowUpRight, Calculator, Landmark } from "lucide-react";
import { BANKS, CURRENCY_NAMES, Locale } from "../constants";
import { convertCurrency, formatRate, NormalizedRate } from "../lib/rates";

interface CurrencyConverterProps {
  rates: NormalizedRate[];
  locale: Locale;
}

const currencies = ["UAH", "USD", "EUR", "PLN"];
const quickAmounts = [100, 500, 1000];
const iconProps = { size: 16, strokeWidth: 2.2 } as const;

export const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ rates, locale }) => {
  const [amount, setAmount] = useState(1000);
  const [from, setFrom] = useState("UAH");
  const [to, setTo] = useState("USD");
  const [bank, setBank] = useState("best");
  const isEnglish = locale === "en";

  const conversion = useMemo(() => convertCurrency(amount, from, to, rates, bank), [amount, from, to, rates, bank]);

  const updateFrom = (value: string) => {
    setFrom(value);
    if (value === to) setTo(value === "UAH" ? "USD" : "UAH");
    if (value !== "UAH" && to !== "UAH") setTo("UAH");
  };

  const updateTo = (value: string) => {
    setTo(value);
    if (value === from) setFrom(value === "UAH" ? "USD" : "UAH");
    if (value !== "UAH" && from !== "UAH") setFrom("UAH");
  };

  return (
    <section id="converter" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-slate-950 p-2 text-white dark:bg-white dark:text-slate-950">
          <Calculator size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">{isEnglish ? "Currency converter" : "Конвертер валют"}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isEnglish ? "UAH, USD, EUR and PLN using live bank rates." : "UAH, USD, EUR і PLN за доступними курсами банків."}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr]">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">{isEnglish ? "Amount" : "Сума"}</span>
          <input
            className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-4 font-mono text-lg font-black outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950"
            min="0"
            type="number"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="inline-flex h-5 items-center text-slate-500" title={isEnglish ? "From" : "З"}>
            <ArrowUpRight {...iconProps} aria-hidden="true" />
            <span className="sr-only">{isEnglish ? "From" : "З"}</span>
          </span>
          <select
            aria-label={isEnglish ? "From currency" : "Валюта з якої конвертуємо"}
            className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 font-bold outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950"
            value={from}
            onChange={(event) => updateFrom(event.target.value)}
          >
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="inline-flex h-5 items-center text-slate-500" title={isEnglish ? "To" : "У"}>
            <ArrowDownRight {...iconProps} aria-hidden="true" />
            <span className="sr-only">{isEnglish ? "To" : "У"}</span>
          </span>
          <select
            aria-label={isEnglish ? "To currency" : "Валюта у яку конвертуємо"}
            className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 font-bold outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950"
            value={to}
            onChange={(event) => updateTo(event.target.value)}
          >
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="inline-flex h-5 items-center text-slate-500" title={isEnglish ? "Bank" : "Банк"}>
            <Landmark {...iconProps} aria-hidden="true" />
            <span className="sr-only">{isEnglish ? "Bank" : "Банк"}</span>
          </span>
          <select
            aria-label={isEnglish ? "Bank" : "Банк"}
            className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 font-bold outline-none ring-cyan-500/20 focus:ring-4 dark:border-slate-800 dark:bg-slate-950"
            value={bank}
            onChange={(event) => setBank(event.target.value)}
          >
            <option value="best">{isEnglish ? "Best available" : "Найкращий доступний"}</option>
            {BANKS.filter((item) => item.id !== "nbu").map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickAmounts.map((value) => (
          <button
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-cyan-500 hover:text-cyan-700 active:scale-[0.98] dark:border-slate-800 dark:text-slate-300"
            key={value}
            onClick={() => setAmount(value)}
            type="button"
          >
            {value}
          </button>
        ))}
        <button
          className="rounded-md border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 transition hover:border-cyan-500 hover:text-cyan-700 active:scale-[0.98] dark:border-slate-800 dark:text-slate-300"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          type="button"
        >
          <ArrowRightLeft className="inline" size={14} /> {isEnglish ? "Swap" : "Поміняти"}
        </button>
      </div>

      <div className="mt-5 rounded-lg bg-slate-950 p-5 text-white dark:bg-slate-950/70">
        <p className="text-xs font-black uppercase tracking-widest text-cyan-300">{isEnglish ? "Result" : "Результат"}</p>
        <p className="mt-2 font-mono text-3xl font-black">
          {conversion.result === null
            ? "—"
            : conversion.result.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}{" "}
          <span className="text-lg text-slate-300">{CURRENCY_NAMES[to]?.symbol || to}</span>
        </p>
        <p className="mt-2 text-sm text-slate-300">
          {isEnglish ? "Rate" : "Курс"}: {formatRate(conversion.rate)} UAH{" "}
          {conversion.bankName ? (
            <span className="inline-flex items-center gap-1">
              <Landmark size={14} strokeWidth={2.2} aria-hidden="true" />
              {conversion.bankName}
            </span>
          ) : null}
        </p>
      </div>
    </section>
  );
};

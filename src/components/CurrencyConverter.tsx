import React, { useMemo, useState } from "react";
import { ArrowDownRight, ArrowRightLeft, ArrowUpRight, Landmark } from "lucide-react";
import { BANKS, CURRENCY_NAMES, Locale } from "../constants";
import { convertCurrency, formatRate, NormalizedRate } from "../lib/rates";

interface CurrencyConverterProps {
  rates: NormalizedRate[];
  locale: Locale;
}

const currencies = ["UAH", "USD", "EUR", "PLN", "GBP", "CHF"];
const quickAmounts = [100, 500, 1000, 5000];
const iconProps = { size: 16, strokeWidth: 2 } as const;

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
    <section id="converter" className="t-reveal rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 dark:border-[#2E2E2E]">
            <img
              src="/illustrations/smart-converter-3d.jpg"
              alt={isEnglish ? "Two glass coins linked by exchange arrows" : "Дві скляні монети зі стрілками обміну"}
              width={256}
              height={256}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div>
            <p className="eyebrow">{isEnglish ? "Calculator" : "Калькулятор"}</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {isEnglish ? "Smart Currency Converter" : "Розумний конвертер валют"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#ADB7BE] sm:text-sm">
              {isEnglish ? "Calculates exact returns using live commercial bank rates." : "Точний розрахунок за актуальними курсами провідних банків."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {quickAmounts.map((value) => (
            <button
              className="rounded-full border border-slate-200 bg-transparent px-3.5 py-1.5 font-mono text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98] dark:border-[#2E2E2E] dark:bg-transparent dark:text-[#ADB7BE] dark:hover:bg-[#2A2A2A]"
              key={value}
              onClick={() => setAmount(value)}
              type="button"
            >
              {value.toLocaleString()}
            </button>
          ))}
          <button
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-transparent px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600 active:scale-[0.98] dark:border-[#2E2E2E] dark:bg-transparent dark:text-[#ADB7BE] dark:hover:border-brand-500 dark:hover:text-brand-300"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            type="button"
          >
            <ArrowRightLeft size={13} /> {isEnglish ? "Swap" : "Поміняти"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {isEnglish ? "Amount" : "Сума"}
          </span>
          <input
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 font-mono text-lg font-semibold tabular-nums text-slate-900 outline-none transition focus:border-brand-400 dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-white"
            min="0"
            type="number"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="inline-flex h-5 items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <ArrowUpRight {...iconProps} aria-hidden="true" />
            <span>{isEnglish ? "From" : "З"}</span>
          </span>
          <select
            aria-label={isEnglish ? "From currency" : "Валюта з якої конвертуємо"}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold text-slate-900 outline-none outline-none transition focus:border-brand-400 dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-white"
            value={from}
            onChange={(event) => updateFrom(event.target.value)}
          >
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code} ({CURRENCY_NAMES[code]?.symbol || ""})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="inline-flex h-5 items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <ArrowDownRight {...iconProps} aria-hidden="true" />
            <span>{isEnglish ? "To" : "У"}</span>
          </span>
          <select
            aria-label={isEnglish ? "To currency" : "Валюта у яку конвертуємо"}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold text-slate-900 outline-none outline-none transition focus:border-brand-400 dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-white"
            value={to}
            onChange={(event) => updateTo(event.target.value)}
          >
            {currencies.map((code) => (
              <option key={code} value={code}>
                {code} ({CURRENCY_NAMES[code]?.symbol || ""})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="inline-flex h-5 items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Landmark {...iconProps} aria-hidden="true" />
            <span>{isEnglish ? "Institution" : "Банк / Тариф"}</span>
          </span>
          <select
            aria-label={isEnglish ? "Bank" : "Банк"}
            className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 font-semibold text-slate-900 outline-none outline-none transition focus:border-brand-400 dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-white"
            value={bank}
            onChange={(event) => setBank(event.target.value)}
          >
            <option value="best">{isEnglish ? "★ Best Available Rate" : "★ Найкращий курс на ринку"}</option>
            {BANKS.filter((item) => item.id !== "nbu").map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Result Card */}
      <div className="mt-6 flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-[#2E2E2E] dark:bg-[#2A2A2A] sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">
            {isEnglish ? "Estimated Total" : "Розрахунковий результат"}
          </p>
          <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-slate-950 dark:text-white sm:text-4xl">
            {conversion.result === null
              ? "—"
              : conversion.result.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}{" "}
            <span className="text-xl font-normal text-slate-500">{CURRENCY_NAMES[to]?.symbol || to}</span>
          </p>
        </div>

        <div className="mt-4 border-t border-slate-200/80 pt-3 dark:border-[#2E2E2E] sm:mt-0 sm:border-0 sm:pt-0 sm:text-right">
          <p className="text-xs text-slate-500 dark:text-[#ADB7BE]">
            {isEnglish ? "Applied rate" : "Застосований курс"}:
          </p>
          <p className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
            1 {from === "UAH" ? to : from} = {formatRate(conversion.rate)} UAH
          </p>
          {conversion.bankName ? (
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              {isEnglish ? "Source:" : "Джерело:"} {conversion.bankName}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
};

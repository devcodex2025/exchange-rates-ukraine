import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";

interface NotFoundProps {
  locale?: "uk" | "en";
}

export const NotFound: React.FC<NotFoundProps> = ({ locale = "uk" }) => {
  const isEn = locale === "en";

  return (
    <main
      id="main-content"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 py-24 text-center"
    >
      {/* 3-digit visual */}
      <div className="relative select-none">
        <span
          aria-hidden="true"
          className="bg-gradient-to-b from-slate-900 to-slate-400 bg-clip-text text-8xl font-semibold leading-none tracking-tight text-transparent dark:from-white dark:to-[#9B9B9B] sm:text-9xl"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          404
        </span>
        {/* subtle glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, rgba(6,182,212,0.08) 0%, transparent 70%)" }}
        />
      </div>

      <div className="flex max-w-md flex-col gap-3">
        <h1
          className="text-2xl font-semibold text-slate-900 dark:text-white"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          {isEn ? "Page not found" : "Сторінку не знайдено"}
        </h1>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-[#ADB7BE]">
          {isEn
            ? "The page you requested does not exist or has been moved. Use the links below to get back on track."
            : "Сторінка, яку ви запитуєте, не існує або була переміщена. Скористайтесь посиланнями нижче."}
        </p>
      </div>

      {/* Quick links */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to={isEn ? "/en" : "/"}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-500 active:scale-[0.98] dark:bg-brand-500 dark:hover:bg-brand-400"
        >
          <TrendingUp size={15} />
          {isEn ? "Live Rates" : "Курси валют"}
        </Link>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98] dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-[#ADB7BE] dark:hover:bg-[#2E2E2E]"
        >
          <ArrowLeft size={15} />
          {isEn ? "Go Back" : "Назад"}
        </button>
      </div>

      {/* Helpful links */}
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-[#ADB7BE]">
        <Link to={isEn ? "/en/usd-uah-rate" : "/kurs-dolara"} className="transition hover:text-brand-700 dark:hover:text-brand-400">
          {isEn ? "USD Rate" : "Курс долара"}
        </Link>
        <Link to={isEn ? "/en/eur-uah-rate" : "/kurs-evro"} className="transition hover:text-brand-700 dark:hover:text-brand-400">
          {isEn ? "EUR Rate" : "Курс євро"}
        </Link>
        <Link to={isEn ? "/en/currency-converter" : "/konverter-valyut"} className="transition hover:text-brand-700 dark:hover:text-brand-400">
          {isEn ? "Converter" : "Конвертер"}
        </Link>
        <Link to={isEn ? "/en/about" : "/pro-nas"} className="transition hover:text-brand-700 dark:hover:text-brand-400">
          {isEn ? "About" : "Про нас"}
        </Link>
      </nav>
    </main>
  );
};

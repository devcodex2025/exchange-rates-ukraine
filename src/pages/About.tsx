import React from "react";
import { Info, Server, ShieldCheck, Target, Sparkles, RefreshCw, Landmark } from "lucide-react";
import { Locale } from "../constants";

interface AboutProps {
  locale?: Locale;
}

export const About: React.FC<AboutProps> = ({ locale = "uk" }) => {
  const isEnglish = locale === "en";

  return (
    <main className="mx-auto max-w-4xl py-8">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#313131] dark:bg-[#1F1F1F] md:p-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-[#313131]">
          <div className="rounded-xl bg-brand-600/10 p-2.5 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
            <Info size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
              {isEnglish ? "About UAH.today" : "Про платформу UAH.today"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300 sm:text-sm">
              {isEnglish
                ? "Independent Ukrainian Currency Exchange Comparison Platform"
                : "Незалежний фінансовий сервіс порівняння курсів валют в Україні"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {isEnglish ? "Our Purpose & Unique Value" : "Наша мета та цінність для користувача"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "UAH.today is an independent fintech portal created to answer three vital financial questions for Ukrainians and guests of the country:"
                : "UAH.today — це незалежний фінансовий сервіс, створений для швидкої та об'єктивної відповіді на три щоденні запитання:"}
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-6 font-medium text-slate-800 dark:text-slate-200">
              <li>
                {isEnglish
                  ? "Where can I buy foreign currency at the lowest available price?"
                  : "Де сьогодні найдешевше купити іноземну валюту?"}
              </li>
              <li>
                {isEnglish
                  ? "Where can I sell foreign currency at the highest available rate?"
                  : "Де найвигідніше здати долари, євро чи злоті?"}
              </li>
              <li>
                {isEnglish
                  ? "How much will my money be worth when converting between institutions?"
                  : "Скільки точно гривень я отримаю при обміні конкретної суми?"}
              </li>
            </ul>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#313131] dark:bg-[#0A0A0A]">
              <Sparkles className="text-emerald-700 dark:text-emerald-400" size={20} />
              <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
                {isEnglish ? "Best Rate Finder" : "Кращий курс"}
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">
                {isEnglish
                  ? "Identifies optimal buy and sell options independently without requiring manual inspection of dozens of rows."
                  : "Автоматично знаходить банк із найвищим курсом прийому та найнижчим курсом продажу валюти."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#313131] dark:bg-[#0A0A0A]">
              <ShieldCheck className="text-brand-700 dark:text-brand-400" size={20} />
              <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
                {isEnglish ? "Verified Sources" : "Офіційні джерела"}
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">
                {isEnglish
                  ? "Direct integrations with National Bank of Ukraine (NBU), PrivatBank, monobank, Raiffeisen, Oschadbank, and PUMB."
                  : "Прямі інтеграції з API НБУ, ПриватБанку, monobank, Райффайзен Банку, Ощадбанку та ПУМБ."}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#313131] dark:bg-[#0A0A0A]">
              <RefreshCw className="text-brand-600 dark:text-brand-300" size={20} />
              <h3 className="mt-2 font-semibold text-slate-900 dark:text-white">
                {isEnglish ? "No Fabricated Data" : "Без штучних замін"}
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-300">
                {isEnglish
                  ? "We never replace missing rates with fake numbers or zeros. Every figure is validated against realistic market boundaries."
                  : "Ми ніколи не домальовуємо нулі або фейкові курси. Усі значення супроводжуються датою оновлення."}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {isEnglish ? "Editorial & Data Integrity Principles" : "Принципи редакційної політики та достовірності"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "UAH.today is not affiliated with any commercial banking institution, ensuring neutral and objective comparisons. Our editorial content is created to educate consumers on currency regulations, risks of unauthorized black-market exchange desks, and methods to protect personal savings."
                : "Платформа UAH.today є незалежною та не належить жодній банківській установі. Ми забезпечуємо неупереджене порівняння без штучного просування окремих фінансових установ. Наші публікації та аналітика спрямовані на підвищення фінансової грамотності, пояснення роботи валютного ринку та захист заощаджень громадян."}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
};

import React from "react";
import { FileText, Scale, AlertTriangle, ShieldCheck, Mail } from "lucide-react";
import { Locale } from "../constants";

interface TermsProps {
  locale?: Locale;
}

export const Terms: React.FC<TermsProps> = ({ locale = "uk" }) => {
  const isEnglish = locale === "en";

  return (
    <main className="mx-auto max-w-4xl py-8">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020] md:p-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-[#2E2E2E]">
          <div className="rounded-xl bg-slate-950 p-2.5 text-white dark:bg-white dark:text-slate-950">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
              {isEnglish ? "Terms of Use" : "Умови використання"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#ADB7BE] sm:text-sm">
              {isEnglish ? "Last updated: November 9, 2026" : "Останнє оновлення: 9 листопада 2026 року"} · UAH.today
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 text-sm leading-7 text-slate-600 dark:text-[#ADB7BE]">
          <section>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <FileText size={18} className="text-brand-700" />
              {isEnglish ? "1. Agreement to Terms" : "1. Прийняття умов"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "By accessing or using the UAH.today service, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you should discontinue using the platform."
                : "Використовуючи веб-сайт UAH.today, ви погоджуєтеся з цими Умовами використання. Якщо ви не згодні з будь-яким пунктом, будь ласка, припиніть користування ресурсом."}
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <AlertTriangle size={18} className="text-amber-500" />
              {isEnglish ? "2. Informational Disclaimer" : "2. Інформаційний характер даних"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "All exchange rates, calculations, and analytical insights presented on UAH.today are strictly for general informational purposes. UAH.today is not a bank, currency exchange operator, or licensed investment advisor. While we strive to ensure timely and validated rates from official APIs, actual rates at specific bank branches, physical tills, or applications may vary."
                : "Уся інформація про курси валют, результати розрахунку конвертера та аналітичні показники на сайті мають виключно ознайомчий характер. Платформа UAH.today не є банківською установою чи обмінним пунктом і не здійснює фінансових операцій. Реальні курси у фізичних відділеннях чи застосунках банків можуть змінюватися протягом дня або залежати від обсягу операції."}
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <ShieldCheck size={18} className="text-brand-700" />
              {isEnglish ? "3. Intellectual Property and Open Data" : "3. Інтелектуальна власність та відкриті дані"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "The interface, branding, code architecture, and editorial guides of UAH.today are protected by copyright. Open data feeds provided under /api/rates and /rates.json may be referenced with attribution to UAH.today and the respective source institutions (NBU, retail banks)."
                : "Дизайн, вихідний код, аналітичні алгоритми та редакційні матеріали сайту захищені авторським правом. Використання структурованих даних платформи через відкриті API-інтерфейси дозволяється з обов'язковим зазначенням джерела UAH.today та відповідних банків-першоджерел."}
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#2E2E2E] dark:bg-[#121212]">
            <h2 className="flex items-center gap-2 text-base font-semibold text-slate-950 dark:text-white">
              <Mail size={18} className="text-brand-700" />
              {isEnglish ? "4. Questions & Feedback" : "4. Зворотний зв'язок"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "For inquiries regarding terms, licensing, or commercial partnership, reach us at: legal@uah.today."
                : "З питань щодо умов використання або партнерства пишіть нам на адресу: legal@uah.today."}
            </p>
          </section>
        </div>
      </article>
    </main>
  );
};

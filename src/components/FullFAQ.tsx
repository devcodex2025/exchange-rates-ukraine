import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_EN, FAQ_UK, UI_COPY } from "../constants";

interface FullFAQProps {
  locale: "uk" | "en";
}

export const FullFAQ: React.FC<FullFAQProps> = ({ locale }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const isEnglish = locale === "en";
  const faq = locale === "en" ? FAQ_EN : FAQ_UK;
  const copy = UI_COPY[locale];

  return (
    <section id="faq" className="t-reveal rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] dark:border-[#313131] dark:bg-[#1F1F1F] sm:p-7">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-slate-200/80 bg-slate-50 text-brand-600 dark:border-[#313131] dark:bg-[#272727] dark:text-brand-300">
          <HelpCircle size={20} />
        </div>
        <div>
          <p className="eyebrow">{isEnglish ? "Answers" : "Питання та відповіді"}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">
            {copy.faqTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {copy.faqSubtitle}
          </p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100 dark:divide-[#313131]">
        {faq.map((item, index) => {
          const open = openIndex === index;
          return (
            <article key={item.question} className="t-acc" data-open={open ? "true" : "false"}>
              <button
                className="flex w-full items-center justify-between gap-4 py-4 text-left"
                onClick={() => setOpenIndex(open ? -1 : index)}
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
              >
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.question}</h3>
                <span className="t-acc-chevron text-slate-500 dark:text-slate-300" aria-hidden="true">
                  <ChevronDown size={18} />
                </span>
              </button>
              <div
                className="t-acc-panel"
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-trigger-${index}`}
                aria-hidden={!open}
              >
                <div className="t-acc-panel-inner">
                  <p className="pb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.answer}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

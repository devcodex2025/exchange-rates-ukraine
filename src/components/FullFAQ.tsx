import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQ_EN, FAQ_UK, UI_COPY } from "../constants";

interface FullFAQProps {
  locale: "uk" | "en";
}

export const FullFAQ: React.FC<FullFAQProps> = ({ locale }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const faq = locale === "en" ? FAQ_EN : FAQ_UK;
  const copy = UI_COPY[locale];

  return (
    <section id="faq" className="t-reveal rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-cyan-50 p-2 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
          <HelpCircle size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-950 dark:text-white">
            {copy.faqTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {copy.faqSubtitle}
          </p>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
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
                <span className="t-acc-chevron text-slate-500 dark:text-slate-400" aria-hidden="true">
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

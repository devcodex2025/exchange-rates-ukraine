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
    <section id="faq" className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
        {faq.map((item, index) => (
          <article key={item.question}>
            <button
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              type="button"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.question}</h3>
              <ChevronDown className={openIndex === index ? "rotate-180 transition" : "transition"} size={18} />
            </button>
            {openIndex === index ? (
              <p className="pb-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.answer}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
};

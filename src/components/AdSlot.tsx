import React from "react";
import { Locale, UI_COPY } from "../constants";

interface AdSlotProps {
  slotId?: string;
  locale: Locale;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotId = "banner-top", locale, className = "" }) => {
  const isEnglish = locale === "en";
  const copy = UI_COPY[locale];

  return (
    <aside
      aria-label={copy.adLabel}
      data-ad-slot={slotId}
      className={`relative my-6 overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center dark:border-[#313131] dark:bg-[#1F1F1F]/30 ${className}`}
    >
      <div className="flex flex-col items-center justify-center min-h-[90px]">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-300">
          {copy.adLabel}
        </span>
        <div className="mt-1 text-xs text-slate-400">
          {isEnglish
            ? "Reserved advertising placement (Google AdSense partner slot)"
            : "Резервне рекламне місце (партнерський слот Google AdSense)"}
        </div>
      </div>
    </aside>
  );
};

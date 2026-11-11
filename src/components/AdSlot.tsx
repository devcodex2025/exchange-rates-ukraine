import React, { useEffect, useRef } from "react";
import { Locale, UI_COPY, ADSENSE } from "../constants";

interface AdSlotProps {
  slotId?: string;
  locale: Locale;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotId = "banner-top", locale, className = "" }) => {
  const isEnglish = locale === "en";
  const copy = UI_COPY[locale];
  const numericSlotId = ADSENSE.slots[slotId] ?? "";
  const pushed = useRef(false);

  useEffect(() => {
    if (!numericSlotId || pushed.current) return;
    pushed.current = true;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      (w.adsbygoogle = w.adsbygoogle || []).push({});
    } catch {
      /* the AdSense loader can be blocked by extensions; the reserved layout stays intact */
    }
  }, [numericSlotId]);

  if (!numericSlotId) {
    return (
      <aside
        aria-label={copy.adLabel}
        data-ad-slot={slotId}
        className={`relative my-6 overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center dark:border-[#2E2E2E] dark:bg-[#202020]/30 ${className}`}
      >
        <div className="flex flex-col items-center justify-center min-h-[90px]">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-[#ADB7BE]">
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
  }

  return (
    <aside aria-label={copy.adLabel} className={`relative my-6 min-h-[90px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 90 }}
        data-ad-client={ADSENSE.client}
        data-ad-slot={numericSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
};

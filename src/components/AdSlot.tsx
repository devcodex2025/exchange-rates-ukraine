import React, { useEffect, useRef, useState } from "react";
import { Locale, UI_COPY, ADSENSE } from "../constants";

interface AdSlotProps {
  slotId?: string;
  locale: Locale;
  className?: string;
}

type AdState = "waiting" | "filled" | "empty";

export const AdSlot: React.FC<AdSlotProps> = ({ slotId = "banner-top", locale, className = "" }) => {
  const isEnglish = locale === "en";
  const copy = UI_COPY[locale];
  const numericSlotId = ADSENSE.slots[slotId] ?? "";
  const [adState, setAdState] = useState<AdState>("waiting");
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!numericSlotId) return;

    if (!pushed.current) {
      pushed.current = true;
      try {
        const w = window as unknown as { adsbygoogle?: unknown[] };
        (w.adsbygoogle = w.adsbygoogle || []).push({});
      } catch {
        /* the loader can be blocked by extensions; the grace timeout below collapses the slot */
      }
    }

    const ins = insRef.current;
    if (!ins) return;

    // AdSense marks the unit with data-ad-status="filled"/"unfilled" once the
    // ad request resolves; collapse the reservation only when it is unfilled,
    // and keep the node mounted so a late fill can still recover the slot.
    const sync = () => {
      const status = ins.getAttribute("data-ad-status");
      if (status === "filled") setAdState("filled");
      else if (status === "unfilled") setAdState("empty");
    };
    sync();

    const observer = new MutationObserver(sync);
    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });

    // No status attribute at all usually means the loader never ran (ad blocker)
    // or the site is still under AdSense review — collapse after a grace period.
    const grace = window.setTimeout(() => {
      setAdState((prev) =>
        prev === "waiting" &&
        !ins.querySelector("iframe") &&
        ins.getAttribute("data-ad-status") !== "filled"
          ? "empty"
          : prev,
      );
    }, 3000);

    return () => {
      observer.disconnect();
      window.clearTimeout(grace);
    };
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
    <aside
      aria-label={copy.adLabel}
      className={`relative my-6 min-h-[90px] ${adState === "empty" ? "hidden" : ""} ${className}`}
    >
      <ins
        ref={insRef}
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

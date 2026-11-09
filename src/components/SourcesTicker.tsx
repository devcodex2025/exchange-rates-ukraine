import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BankLogo } from "./ui/bank-logo";

interface TickerSource {
  id: string;
  name: string;
  logo?: string;
  ok: boolean;
  source: string;
  count: number;
}

interface SourcesTickerProps {
  sources: TickerSource[];
  isEnglish: boolean;
}

/**
 * Data sources band in the ui8 spirit: an infinite right-to-left marquee of
 * bank chips (status dot + logo + name) on a full-bleed hairline band.
 * GSAP drives a seamless two-copy loop at a constant px/s speed; hovering
 * the band pauses it so tooltips can be read. With reduced motion the
 * copies collapse into the old static wrapped row.
 */
export const SourcesTicker: React.FC<SourcesTickerProps> = ({ sources, isEnglish }) => {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = track.current;
    const shell = viewport.current;
    if (!node || !shell || sources.length === 0) return undefined;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const half = node.scrollWidth / 2;
      if (half <= 0) return undefined;
      const tween = gsap.to(node, {
        xPercent: -50,
        ease: "none",
        duration: Math.max(20, half / 46),
        repeat: -1,
      });
      const stop = () => tween.pause();
      const go = () => tween.play();
      shell.addEventListener("mouseenter", stop);
      shell.addEventListener("mouseleave", go);
      return () => {
        shell.removeEventListener("mouseenter", stop);
        shell.removeEventListener("mouseleave", go);
        tween.kill();
      };
    });
    return () => media.revert();
  }, [sources]);

  if (sources.length === 0) return null;

  const statusText = (source: TickerSource) =>
    isEnglish
      ? `${source.name}: ${source.count} rates from ${source.source}, ${source.ok ? "active" : "offline"}.`
      : `${source.name}: ${source.count} курсів із "${source.source}", ${source.ok ? "активне" : "недоступне"}.`;

  return (
    <section
      aria-label={isEnglish ? "Data sources" : "Джерела даних"}
      className="relative -mx-4 border-y border-slate-200/70 bg-white/70 sm:-mx-6 lg:-mx-8 dark:border-[#2E2E2E] dark:bg-[#161616]"
    >
      {/* Programmatic truth: the marquee copies stay visual-only. */}
      <ul className="sr-only">
        {sources.map((source) => (
          <li key={source.id}>{statusText(source)}</li>
        ))}
      </ul>

      <div ref={viewport} className="sources-ticker py-3.5">
        <div ref={track} className="sources-ticker-track flex w-max items-center will-change-transform">
          {sources.length > 0 ? (
            <ul className="flex w-max items-center">
              {sources.map((source) => (
                <li key={source.id} className="t-tip-group relative mr-10 flex items-center gap-3 sm:mr-14" aria-hidden="true">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${source.ok ? "bg-emerald-500" : "bg-slate-300 dark:bg-[#3A3A3A]"}`}
                  />
                  {source.logo ? <BankLogo src={source.logo} alt="" className="h-5 w-auto max-w-36" /> : null}
                  <span className="whitespace-nowrap text-[13px] font-semibold text-slate-500 dark:text-[#ADB7BE]">
                    {source.name}
                  </span>
                  <span className="t-tip" role="tooltip">
                    {source.source}: {source.count} {isEnglish ? "rates" : "курсів"}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="sources-ticker-clone flex w-max items-center" aria-hidden="true">
            {sources.map((source) => (
              <li key={source.id} className="t-tip-group relative mr-10 flex items-center gap-3 sm:mr-14">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${source.ok ? "bg-emerald-500" : "bg-slate-300 dark:bg-[#3A3A3A]"}`}
                />
                {source.logo ? <BankLogo src={source.logo} alt="" className="h-5 w-auto max-w-36" /> : null}
                <span className="whitespace-nowrap text-[13px] font-semibold text-slate-500 dark:text-[#ADB7BE]">
                  {source.name}
                </span>
                <span className="t-tip" role="tooltip">
                  {source.source}: {source.count} {isEnglish ? "rates" : "курсів"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

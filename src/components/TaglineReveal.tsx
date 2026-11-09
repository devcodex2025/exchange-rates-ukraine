import React, { useEffect, useRef, useState } from "react";
import { Locale } from "../constants";

interface TaglineRevealProps {
  locale: Locale;
}

export const TaglineReveal: React.FC<TaglineRevealProps> = ({ locale }) => {
  const isEnglish = locale === "en";
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeWords, setActiveWords] = useState<number>(0);

  const text = isEnglish
    ? "Compare verified bank rates in real time. Know exactly where to buy, where to sell, and keep more of your money with zero guesswork."
    : "Порівнюйте перевірені курси валют у реальному часі. Знайте точно, де вигідніше купити, де продати, і заощаджуйте на кожному обміні.";

  const words = text.split(" ");

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveWords(words.length);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!container) return;
          const rect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          // Trigger range: starts when top enters middle of screen (0.75), finishes near top (0.35)
          const start = windowHeight * 0.85;
          const end = windowHeight * 0.35;
          const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));

          const count = Math.floor(progress * words.length);
          setActiveWords(count);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [words.length]);

  return (
    <section
      ref={containerRef}
      className="my-16 px-6 py-8 sm:px-10"
      aria-label="Core Value Tagline"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">
          {isEnglish ? "Our Promise" : "Наш головний принцип"}
        </p>

        <h2 className="mt-4 text-2xl font-semibold leading-relaxed tracking-tight sm:text-4xl sm:leading-snug">
          {words.map((word, index) => {
            const isLit = index < activeWords;
            return (
              <span
                key={`${word}-${index}`}
                className="inline-block transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  color: isLit
                    ? "inherit"
                    : "rgba(122, 130, 140, 0.35)", // muted tone per rule B11
                  marginRight: "0.28em",
                }}
              >
                {word}
              </span>
            );
          })}
        </h2>

        <div className="mt-8 flex justify-center gap-3">
          <a
            href="#best-rates"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition duration-300 hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {isEnglish ? "View Best Rates Today" : "Переглянути кращий курс"}
          </a>
        </div>
      </div>
    </section>
  );
};

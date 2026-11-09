import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PopNumberProps {
  value: number | null | undefined;
  decimals?: number;
  className?: string;
  placeholder?: string;
}

interface Drum {
  /** Old string the drum swaps away from; null = silent render. */
  from: string | null;
  /** Bumped on every animated swap so the keyed group remounts and the CSS rolls. */
  id: number;
  /** Entrance roll on first scroll-into-view: every digit drums, shared digits are not skipped. */
  rollAll: boolean;
}

/** Cheap viewport test for the "drum only what the user can see" rule. */
const isOnScreen = (element: HTMLElement | null) => {
  if (!element) return false;
  const rect = element.getBoundingClientRect();
  const height = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < height * 0.96 && rect.bottom > 0;
};

/**
 * Number pop-in from transitions.dev, gated by GSAP ScrollTrigger.
 * On page load digits fill in silently - nothing drums until the user
 * scrolls. With the first scroll every group rolls its digits once as it
 * enters the viewport (ScrollTrigger, once). Afterwards live updates drum
 * the changed digits only when the number is actually on screen; off-screen
 * refreshes land quietly.
 */
export const PopNumber: React.FC<PopNumberProps> = ({
  value,
  decimals = 2,
  className,
  placeholder = "—",
}) => {
  const format = (input: number | null | undefined) =>
    input === null || input === undefined || !Number.isFinite(input)
      ? placeholder
      : input.toFixed(decimals);

  const previous = useRef<string>(format(value));
  const shell = useRef<HTMLSpanElement>(null);
  const entered = useRef(false);
  const [current, setCurrent] = useState<string>(format(value));
  const [drum, setDrum] = useState<Drum>({ from: null, id: 0, rollAll: false });

  useEffect(() => {
    const next = format(value);
    if (next === previous.current) return;
    const old = previous.current;
    previous.current = next;
    setCurrent(next);
    if (entered.current && isOnScreen(shell.current)) {
      // Live update while visible: drum the changed digits.
      setDrum((d) => ({ from: old, id: d.id + 1, rollAll: false }));
    } else {
      // First data arrival or an off-screen refresh: fill in silently.
      setDrum((d) => ({ ...d, from: null }));
    }
  }, [value]);

  useEffect(() => {
    let trigger: ScrollTrigger | null = null;

    const fire = () => {
      if (entered.current) return;
      entered.current = true;
      // Entrance roll: the digits drum from themselves on scroll-into-view.
      setDrum((d) => ({ from: previous.current, id: d.id + 1, rollAll: true }));
    };

    const arm = () => {
      if (trigger || !shell.current) return;
      trigger = ScrollTrigger.create({
        trigger: shell.current,
        start: "top 92%",
        once: true,
        onEnter: fire,
      });
      // Groups already past the line on the first user scroll roll immediately.
      if (shell.current.getBoundingClientRect().top < window.innerHeight * 0.92) fire();
    };

    if (window.scrollY > 0) {
      arm();
    } else {
      const onScroll = () => {
        if ((window.scrollY || 0) > 0) {
          arm();
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        if (trigger) trigger.kill();
      };
    }
    return () => {
      if (trigger) trigger.kill();
    };
  }, []);

  const animate = drum.from !== null;
  const sameLength = drum.from != null && drum.from.length === current.length;
  let shared = 0;
  if (drum.from != null && sameLength) {
    while (shared < current.length && drum.from[shared] === current[shared]) shared += 1;
  }

  return (
    <span ref={shell} className={`t-digit-reveal ${className ?? ""}`.trim()} aria-label={current}>
      <span key={`${current}:${drum.id}`} className={`t-digit-group ${animate ? "is-animating" : ""}`}>
        {[...current].map((character, index) => {
          const fromEnd = current.length - 1 - index;
          const isDigit = /\d/.test(character);
          const oldCharacter = drum.from != null && sameLength ? drum.from[index] : null;

          // Separators always stay still; shared leading digits stay still
          // during change swaps, but roll during the entrance.
          const silent = !isDigit || (!drum.rollAll && index < shared);
          if (silent) {
            return (
              <span key={`same-${index}`} className="t-digit" data-same="">
                {character}
              </span>
            );
          }

          const stagger = fromEnd === 1 ? { "data-stagger": "1" as const } : fromEnd === 0 ? { "data-stagger": "2" as const } : {};

          return (
            <span key={`slot-${index}`} className="t-digit-slot" {...stagger}>
              {oldCharacter != null && isDigit ? (
                <span className="t-digit-old" aria-hidden="true">
                  {oldCharacter}
                </span>
              ) : null}
              <span className="t-digit">{character}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
};

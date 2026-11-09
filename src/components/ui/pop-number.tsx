import React, { useEffect, useRef, useState } from "react";

interface PopNumberProps {
  value: number | null | undefined;
  decimals?: number;
  className?: string;
  placeholder?: string;
}

/**
 * Number pop-in from transitions.dev: each changed digit swaps on a 3D drum.
 * The old digit leaves upward, the new one rises just after it, pulls back
 * and springs into place past 100%. Leading digits the old and new number
 * share are marked data-same and stay still; the last two changed digits
 * ride 1x / 2x --digit-stagger behind the others.
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
  const [current, setCurrent] = useState<string>(format(value));
  const [from, setFrom] = useState<string | null>(null);

  useEffect(() => {
    const next = format(value);
    if (next === previous.current) return;

    setFrom(previous.current);
    setCurrent(next);
    previous.current = next;
  }, [value]);

  // How many leading characters the old and new numbers share.
  let same = 0;
  if (from) {
    while (same < from.length && same < current.length && from[same] === current[same]) same++;
  }
  const animate = from !== null;

  return (
    <span
      key={current}
      className={`t-digit-group ${animate ? "is-animating" : ""} ${className ?? ""}`.trim()}
      aria-label={current}
    >
      {[...current].map((character, index) => {
        const fromEnd = current.length - 1 - index;
        const oldCharacter = from ? from[from.length - (current.length - index)] : null;
        const hasOld = Boolean(from && oldCharacter && /\d/.test(oldCharacter) && /\d/.test(character) && from.length === current.length);

        if (!/\d/.test(character) || (!!from && index < same && from[index] === character)) {
          // Shared characters and separators stay still.
          return (
            <span key={`same-${index}`} className="t-digit" data-same="">
              {character}
            </span>
          );
        }

        const stagger = fromEnd === 1 ? { "data-stagger": "1" as const } : fromEnd === 0 ? { "data-stagger": "2" as const } : {};

        return (
          <span key={`slot-${index}`} className="t-digit-slot" {...stagger}>
            {hasOld ? (
              <span className="t-digit-old" aria-hidden="true">
                {oldCharacter}
              </span>
            ) : null}
            <span className="t-digit">{character}</span>
          </span>
        );
      })}
    </span>
  );
};

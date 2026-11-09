import React, { useEffect, useRef, useState } from "react";

interface SubtleNumberProps {
  value: number | null | undefined;
  decimals?: number;
  className?: string;
  placeholder?: string;
}

interface NumberState {
  from: string | null;
  to: string;
  direction: 1 | -1;
}

/**
 * Number subtle change from transitions.dev: only the digits that changed
 * cross-fade in place, rising when the value grows and falling when it drops.
 */
export const SubtleNumber: React.FC<SubtleNumberProps> = ({
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
  const [state, setState] = useState<NumberState>({
    from: null,
    to: format(value),
    direction: 1,
  });

  useEffect(() => {
    const next = format(value);
    const last = previous.current;
    if (next === last) return;

    previous.current = next;
    setState({
      from: last,
      to: next,
      direction: (value ?? 0) >= Number.parseFloat(last) ? 1 : -1,
    });
  }, [value]);

  const { from, to, direction } = state;
  const sameLength = from !== null && from.length === to.length;
  const animate = from !== null;

  return (
    <span
      key={to}
      className={`t-subtle-number ${animate ? "is-animating" : ""} ${className ?? ""}`}
      style={{ "--subtle-dir": direction } as React.CSSProperties}
      aria-label={to}
    >
      {[...to].map((character, index) =>
        sameLength && from![index] === character ? (
          <span key={`same-${index}`}>{character}</span>
        ) : (
          <span key={`slot-${index}`} className="t-subtle-slot">
            {sameLength ? (
              <span className="t-subtle-old" aria-hidden="true">
                {from![index]}
              </span>
            ) : null}
            <span className="t-subtle-new">{character}</span>
          </span>
        ),
      )}
    </span>
  );
};

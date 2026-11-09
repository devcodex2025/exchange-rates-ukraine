import React from "react";

/**
 * Currency glyph set (UAH, USD, EUR, GBP, PLN, CHF).
 * Path data comes from Tabler Icons v3.50 — https://tabler.io/icons (MIT, © Paweł Kuna)
 * — the only modern stroke set that covers hryvnia and zloty alongside the majors.
 * Lucide itself has no hryvnia/zloty upstream (verified). Tabler and Lucide share
 * the same 24px grid and 2px stroke, so the glyphs sit seamlessly next to lucide-react.
 */
const GLYPH_PATHS: Record<string, string[]> = {
  UAH: [
    "M8 7a2.64 2.64 0 0 1 2.562 -2h3.376a2.64 2.64 0 0 1 2.562 2a2.57 2.57 0 0 1 -1.344 2.922l-5.876 2.938a3.338 3.338 0 0 0 -1.78 3.64a3.11 3.11 0 0 0 3.05 2.5h2.888a2.64 2.64 0 0 0 2.562 -2",
    "M6 10h12",
    "M6 14h12",
  ],
  USD: ["M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2", "M12 3v3m0 12v3"],
  EUR: ["M17.2 7a6 7 0 1 0 0 10", "M13 10h-8m0 4h8"],
  GBP: ["M17 18.5a6 6 0 0 1 -5 0a6 6 0 0 0 -5 .5a3 3 0 0 0 2 -2.5v-7.5a4 4 0 0 1 7.45 -2m-2.55 6h-7"],
  PLN: ["M12 18h-7l7 -7h-7", "M17 18v-13", "M14 14.5l6 -3.5"],
  CHF: ["M17 5h-6a2 2 0 0 0 -2 2v12", "M7 15h4", "M9 11h7"],
};

export const hasCurrencyGlyph = (code: string) => Boolean(GLYPH_PATHS[code]);

interface CurrencyGlyphProps {
  code: string;
  size?: number;
  className?: string;
}

/** Inline 24px-grid stroke glyph; colors via currentColor so it follows the tile theming. */
export const CurrencyGlyph: React.FC<CurrencyGlyphProps> = ({ code, size = 18, className }) => {
  const paths = GLYPH_PATHS[code];
  if (!paths) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`currency-glyph ${className ?? ""}`.trim()}
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
};

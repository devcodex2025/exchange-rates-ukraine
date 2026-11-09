import React from "react";

// Banks whose logo carries near-black glyphs need a dedicated dark variant;
// pumb (red) and oschad (gold on green) read well on both canvases.
const DARK_LOGO_BASENAMES = new Set(["privat", "mono", "raiffeisen", "nbu"]);

/** Maps /logos/<name>.<ext> to its /logos/dark variant when one exists. */
export const darkLogoSrc = (src: string) => {
  const clean = src.split("?")[0];
  const dot = clean.lastIndexOf(".");
  const name = clean.slice(clean.lastIndexOf("/") + 1, dot);
  const ext = clean.slice(dot + 1);
  return DARK_LOGO_BASENAMES.has(name) ? `/logos/dark/${name}.${ext}` : src;
};

interface BankLogoProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Bank logo that stays readable in the dark theme: the original is shown in
 * the light theme, the /logos/dark variant in the dark one. Exactly one of
 * the two <img> elements is rendered at a time.
 */
export const BankLogo: React.FC<BankLogoProps> = ({ src, alt, className }) => (
  <>
    <img src={src} alt={alt} className={`${className ?? ""} dark:hidden`.trim()} loading="lazy" />
    <img
      src={darkLogoSrc(src)}
      alt=""
      aria-hidden="true"
      className={`${className ?? ""} hidden dark:block`.trim()}
      loading="lazy"
    />
  </>
);

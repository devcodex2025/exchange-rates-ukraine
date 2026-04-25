import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const constants = readFileSync(join(root, "src", "constants.ts"), "utf8");

const ukBlockMatch = constants.match(/uk:\s*\{([\s\S]*?)\n\s*\},\n\s*en:/);
const faqUkMatch = constants.match(/export const FAQ_UK = \[([\s\S]*?)\];/);

if (!ukBlockMatch || !faqUkMatch) {
  throw new Error("Could not locate Ukrainian UI copy blocks.");
}

const forbidden = [
  "View rates",
  "Currency converter",
  "Last update",
  "Data sources",
  "Source transparency",
  "Best buy",
  "Best sell",
  "No data",
  "Search bank",
  "Exchange rate FAQ",
  "Short definitions",
  "Open bank account",
  "Rate alerts",
  "Chart placeholder",
  "Loading chart",
];

const ukSurface = `${ukBlockMatch[1]}\n${faqUkMatch[1]}`;
const leaks = forbidden.filter((phrase) => ukSurface.includes(phrase));

if (leaks.length) {
  throw new Error(`English UI text leaked into Ukrainian copy: ${leaks.join(", ")}`);
}

console.log("i18n check passed: Ukrainian copy has no known English UI phrases.");

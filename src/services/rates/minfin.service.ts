import { validateBankRatePair } from "../../lib/rates/validation.js";
import { NormalizedBankRate } from "./privatbank.service.js";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// A cash rate row on a minfin bank page reads like:
// "USD 45.4000 0 46.0000 0 08.11.2026" (code, buy, change, sell, change, date).
const RATE_ROW = /\b(USD|EUR|PLN|GBP|CHF)\s+(\d+(?:[.,]\d+)?)\s+[-+]?\d+(?:[.,]\d+)?\s+(\d+(?:[.,]\d+)?)\s+[-+]?\d+(?:[.,]\d+)?\s+\d{2}\.\d{2}\.\d{4}/g;

/**
 * minfin.com.ua keeps a public cash rate table for every bank. The table is
 * server rendered, so a single request per bank is enough and no API key is
 * required. Parsing keeps the first row per currency, which is the cash rate
 * table shown above the card rate table.
 */
export class MinfinBankService {
  private static baseUrl = "https://minfin.com.ua/company";

  static async fetchRates(slug: string, signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    const res = await fetch(`${this.baseUrl}/${slug}/currency/`, {
      signal,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
    });

    if (!res.ok) {
      throw new Error(`minfin page returned status ${res.status}`);
    }

    return MinfinBankService.parse(await res.text());
  }

  static parse(html: string): NormalizedBankRate[] {
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ");

    const byCurrency = new Map<string, NormalizedBankRate>();

    for (const match of text.matchAll(RATE_ROW)) {
      const code = match[1];
      if (byCurrency.has(code)) continue;

      const validated = validateBankRatePair(code, match[2], match[3]);
      if (!validated.valid) continue;

      byCurrency.set(code, {
        currency: code,
        buy: validated.sanitizedBuy,
        sell: validated.sanitizedSell,
      });
    }

    return [...byCurrency.values()];
  }
}

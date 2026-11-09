import { validateBankRatePair } from "../../lib/rates/validation.js";
import { NormalizedBankRate } from "./privatbank.service.js";

export class RaiffeisenService {
  private static URL = "https://finance.ua/ua/currency/banks/raif";

  static async fetchRates(signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    try {
      const res = await fetch(this.URL, {
        signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const html = await res.text();
      const results: NormalizedBankRate[] = [];

      const extractCurrency = (code: string) => {
        const regex = new RegExp(`${code}[^0-9]*?([0-9]+[.,][0-9]+)[^0-9]*?([0-9]+[.,][0-9]+)`, "i");
        const match = html.match(regex);
        if (match) {
          const val = validateBankRatePair(code, match[1], match[2]);
          if (val.valid) {
            results.push({
              currency: code,
              buy: val.sanitizedBuy,
              sell: val.sanitizedSell,
            });
          }
        }
      };

      ["USD", "EUR", "PLN", "GBP", "CHF"].forEach(extractCurrency);
      return results;
    } catch (error) {
      console.warn("Raiffeisen fetch warning:", error instanceof Error ? error.message : error);
      return [];
    }
  }
}

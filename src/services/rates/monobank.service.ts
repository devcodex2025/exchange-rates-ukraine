import { validateBankRatePair } from "../../lib/rates/validation.js";
import { NormalizedBankRate } from "./privatbank.service.js";

export interface MonoRawItem {
  currencyCodeA: number;
  currencyCodeB: number;
  date: number;
  rateBuy?: number;
  rateSell?: number;
  rateCross?: number;
}

const ISO_MAP: Record<number, string> = {
  840: "USD",
  978: "EUR",
  985: "PLN",
  826: "GBP",
  756: "CHF",
};

export class MonobankService {
  private static URL = "https://api.monobank.ua/bank/currency";

  static async fetchRates(signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    const res = await fetch(this.URL, { signal });
    if (res.status === 429) {
      throw new Error("MONO_RATE_LIMIT");
    }
    if (!res.ok) {
      throw new Error(`monobank API returned status ${res.status}`);
    }

    const data: MonoRawItem[] = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid monobank response format");
    }

    const results: NormalizedBankRate[] = [];

    for (const item of data) {
      // currencyCodeB === 980 means quoted against UAH
      if (item.currencyCodeB === 980) {
        const code = ISO_MAP[item.currencyCodeA];
        if (code) {
          const buy = item.rateBuy ?? item.rateCross;
          const sell = item.rateSell ?? item.rateCross;
          const val = validateBankRatePair(code, buy, sell);
          if (val.valid) {
            results.push({
              currency: code,
              buy: val.sanitizedBuy,
              sell: val.sanitizedSell,
            });
          }
        }
      }
    }

    return results;
  }
}

import { validateBankRatePair } from "../../lib/rates/validation.js";

export interface PrivatRawItem {
  ccy: string;
  base_ccy: string;
  buy: string;
  sale: string;
}

export interface NormalizedBankRate {
  currency: string;
  buy: number | null;
  sell: number | null;
}

export class PrivatBankService {
  private static URL = "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=5";

  static async fetchRates(signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    const res = await fetch(this.URL, { signal });
    if (!res.ok) {
      throw new Error(`PrivatBank API returned status ${res.status}`);
    }

    const data: PrivatRawItem[] = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid PrivatBank API response format");
    }

    const results: NormalizedBankRate[] = [];
    const supported = new Set(["USD", "EUR", "PLN", "GBP", "CHF"]);

    for (const item of data) {
      const code = item.ccy?.toUpperCase();
      if (supported.has(code)) {
        const val = validateBankRatePair(code, item.buy, item.sale);
        if (val.valid) {
          results.push({
            currency: code,
            buy: val.sanitizedBuy,
            sell: val.sanitizedSell,
          });
        }
      }
    }

    return results;
  }
}

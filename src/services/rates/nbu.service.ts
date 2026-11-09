import { validateBankRatePair } from "../../lib/rates/validation.js";

export interface NbuRawItem {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

export interface NormalizedNbuRate {
  currency: string;
  rate: number;
  exchangeDate: string;
}

export class NbuService {
  private static URL = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

  static async fetchRates(signal?: AbortSignal): Promise<NormalizedNbuRate[]> {
    const res = await fetch(this.URL, { signal });
    if (!res.ok) {
      throw new Error(`NBU API returned status ${res.status}`);
    }

    const data: NbuRawItem[] = await res.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid NBU API response structure");
    }

    const supported = new Set(["USD", "EUR", "PLN", "GBP", "CHF"]);
    const results: NormalizedNbuRate[] = [];

    for (const item of data) {
      if (supported.has(item.cc)) {
        const val = validateBankRatePair(item.cc, item.rate, item.rate);
        if (val.valid && val.sanitizedBuy !== null) {
          results.push({
            currency: item.cc,
            rate: val.sanitizedBuy,
            exchangeDate: item.exchangedate,
          });
        }
      }
    }

    return results;
  }
}

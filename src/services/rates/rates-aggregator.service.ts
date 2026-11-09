import { globalCache } from "../cache/cache.service";
import { NbuService, NormalizedNbuRate } from "./nbu.service";
import { PrivatBankService, NormalizedBankRate } from "./privatbank.service";
import { MonobankService } from "./monobank.service";
import { RaiffeisenService } from "./raiffeisen.service";
import { OschadbankService } from "./oschadbank.service";
import { PumbService } from "./pumb.service";

export interface SourceMeta {
  sourceName: string;
  fetchedAt: string;
  sourceUpdatedAt: string | null;
  status: "fresh" | "cached" | "stale" | "unavailable";
  isStale: boolean;
  errorMessage: string | null;
  count: number;
}

export interface AggregatedRatesResponse {
  base: "UAH";
  updatedAt: string;
  nbu: Array<{ cc: string; rate: number; exchangedate?: string }>;
  privat: Array<{ ccy: string; buy: number | null; sale: number | null }>;
  mono: Array<{ currencyCodeA: number; currencyCodeB: number; rateBuy?: number; rateSell?: number; rateCross?: number }>;
  raif: Array<{ cc: string; buy: number | null; sale: number | null }>;
  oschad: Array<{ cc: string; buy: number | null; sale: number | null }>;
  pumb: Array<{ cc: string; buy: number | null; sale: number | null }>;
  sources: Record<string, SourceMeta>;
}

const CACHE_TTL_DEFAULT = 15 * 60 * 1000; // 15 mins
const CACHE_TTL_MONO = 30 * 60 * 1000;    // 30 mins

export class RatesAggregatorService {
  static async getAggregatedRates(forceFresh = false): Promise<AggregatedRatesResponse> {
    const updatedAt = new Date().toISOString();

    // 1. NBU
    const nbuResult = await globalCache.getOrFetch<NormalizedNbuRate[]>(
      "nbu_rates",
      async () => {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 7000);
        try {
          return await NbuService.fetchRates(controller.signal);
        } finally {
          clearTimeout(t);
        }
      },
      CACHE_TTL_DEFAULT,
      forceFresh,
    );

    // 2. PrivatBank
    const privatResult = await globalCache.getOrFetch<NormalizedBankRate[]>(
      "privat_rates",
      async () => {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 7000);
        try {
          return await PrivatBankService.fetchRates(controller.signal);
        } finally {
          clearTimeout(t);
        }
      },
      CACHE_TTL_DEFAULT,
      forceFresh,
    );

    // 3. Monobank
    const monoResult = await globalCache.getOrFetch<NormalizedBankRate[]>(
      "mono_rates",
      async () => {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 7000);
        try {
          return await MonobankService.fetchRates(controller.signal);
        } finally {
          clearTimeout(t);
        }
      },
      CACHE_TTL_MONO,
      forceFresh,
    );

    // 4. Raiffeisen
    const raifResult = await globalCache.getOrFetch<NormalizedBankRate[]>(
      "raif_rates",
      async () => {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 5000);
        try {
          return await RaiffeisenService.fetchRates(controller.signal);
        } finally {
          clearTimeout(t);
        }
      },
      CACHE_TTL_DEFAULT,
      forceFresh,
    );

    // 5. Oschadbank
    const oschadResult = await globalCache.getOrFetch<NormalizedBankRate[]>(
      "oschad_rates",
      async () => {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 5000);
        try {
          return await OschadbankService.fetchRates(controller.signal);
        } finally {
          clearTimeout(t);
        }
      },
      CACHE_TTL_DEFAULT,
      forceFresh,
    );

    // 6. PUMB
    const pumbResult = await globalCache.getOrFetch<NormalizedBankRate[]>(
      "pumb_rates",
      async () => {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 5000);
        try {
          return await PumbService.fetchRates(controller.signal);
        } finally {
          clearTimeout(t);
        }
      },
      CACHE_TTL_DEFAULT,
      forceFresh,
    );

    const makeMeta = (
      name: string,
      result: { data: unknown[] | null; isStale: boolean; fetchedAt: string },
    ): SourceMeta => {
      const hasData = Array.isArray(result.data) && result.data.length > 0;
      let status: SourceMeta["status"] = "unavailable";
      if (hasData) {
        status = result.isStale ? "stale" : "fresh";
      }

      return {
        sourceName: name,
        fetchedAt: result.fetchedAt,
        sourceUpdatedAt: hasData ? result.fetchedAt : null,
        status,
        isStale: result.isStale,
        errorMessage: hasData ? null : "Source temporarily unavailable",
        count: Array.isArray(result.data) ? result.data.length : 0,
      };
    };

    const nbuData = nbuResult.data || [];
    const privatData = privatResult.data || [];
    const monoData = monoResult.data || [];
    const raifData = raifResult.data || [];
    const oschadData = oschadResult.data || [];
    const pumbData = pumbResult.data || [];

    // Map mono to ISO code pairs compatible with legacy front-end expectations
    const ISO_TO_NUM: Record<string, number> = {
      USD: 840,
      EUR: 978,
      PLN: 985,
      GBP: 826,
      CHF: 756,
    };

    const monoPayload = monoData.map((m) => ({
      currencyCodeA: ISO_TO_NUM[m.currency] || 0,
      currencyCodeB: 980,
      rateBuy: m.buy ?? undefined,
      rateSell: m.sell ?? undefined,
      rateCross: undefined,
    }));

    return {
      base: "UAH",
      updatedAt,
      nbu: nbuData.map((item) => ({ cc: item.currency, rate: item.rate, exchangedate: item.exchangeDate })),
      privat: privatData.map((item) => ({ ccy: item.currency, buy: item.buy, sale: item.sell })),
      mono: monoPayload,
      raif: raifData.map((item) => ({ cc: item.currency, buy: item.buy, sale: item.sell })),
      oschad: oschadData.map((item) => ({ cc: item.currency, buy: item.buy, sale: item.sell })),
      pumb: pumbData.map((item) => ({ cc: item.currency, buy: item.buy, sale: item.sell })),
      sources: {
        nbu: makeMeta("National Bank of Ukraine API", nbuResult),
        privat: makeMeta("PrivatBank API", privatResult),
        mono: makeMeta("monobank API", monoResult),
        raif: makeMeta("Raiffeisen Bank Feed", raifResult),
        oschad: makeMeta("Oschadbank Feed", oschadResult),
        pumb: makeMeta("PUMB Feed", pumbResult),
      },
    };
  }
}

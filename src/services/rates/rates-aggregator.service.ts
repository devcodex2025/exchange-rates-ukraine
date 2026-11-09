import { globalCache } from "../cache/cache.service.js";
import { NbuService, NormalizedNbuRate } from "./nbu.service.js";
import { PrivatBankService, NormalizedBankRate } from "./privatbank.service.js";
import { MonobankService } from "./monobank.service.js";
import { RaiffeisenService } from "./raiffeisen.service.js";
import { OschadbankService } from "./oschadbank.service.js";
import { PumbService } from "./pumb.service.js";

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

// Serverless functions are time limited, so fetch every provider with a hard
// per request budget and run them concurrently instead of one after another.
const SOURCE_TIMEOUT_MS = 6000;

const withTimeout = async <T>(fetcher: (signal: AbortSignal) => Promise<T>): Promise<T> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SOURCE_TIMEOUT_MS);
  try {
    return await fetcher(controller.signal);
  } finally {
    clearTimeout(timer);
  }
};

export class RatesAggregatorService {
  static async getAggregatedRates(forceFresh = false): Promise<AggregatedRatesResponse> {
    const updatedAt = new Date().toISOString();

    const [nbuResult, privatResult, monoResult, raifResult, oschadResult, pumbResult] = await Promise.all([
      globalCache.getOrFetch<NormalizedNbuRate[]>(
        "nbu_rates",
        () => withTimeout((signal) => NbuService.fetchRates(signal)),
        CACHE_TTL_DEFAULT,
        forceFresh,
      ),
      globalCache.getOrFetch<NormalizedBankRate[]>(
        "privat_rates",
        () => withTimeout((signal) => PrivatBankService.fetchRates(signal)),
        CACHE_TTL_DEFAULT,
        forceFresh,
      ),
      globalCache.getOrFetch<NormalizedBankRate[]>(
        "mono_rates",
        () => withTimeout((signal) => MonobankService.fetchRates(signal)),
        CACHE_TTL_MONO,
        forceFresh,
      ),
      globalCache.getOrFetch<NormalizedBankRate[]>(
        "raif_rates",
        () => withTimeout((signal) => RaiffeisenService.fetchRates(signal)),
        CACHE_TTL_DEFAULT,
        forceFresh,
      ),
      globalCache.getOrFetch<NormalizedBankRate[]>(
        "oschad_rates",
        () => withTimeout((signal) => OschadbankService.fetchRates(signal)),
        CACHE_TTL_DEFAULT,
        forceFresh,
      ),
      globalCache.getOrFetch<NormalizedBankRate[]>(
        "pumb_rates",
        () => withTimeout((signal) => PumbService.fetchRates(signal)),
        CACHE_TTL_DEFAULT,
        forceFresh,
      ),
    ]);

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

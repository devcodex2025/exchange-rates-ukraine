import { BANKS, CURRENCY_MAP, CURRENCY_NAMES } from "../../constants";
import { AggregatedRatesResponse, SourceMeta } from "../../services/rates/rates-aggregator.service";
import { sanitizeNumber, validateBankRatePair } from "./validation";

export interface RawRatesResponse {
  base?: string;
  nbu?: Array<{ cc: string; rate: number; exchangedate?: string }>;
  privat?: Array<{ ccy: string; buy: number | string | null; sale: number | string | null }>;
  mono?: Array<{ currencyCodeA: number; currencyCodeB: number; rateBuy?: number; rateSell?: number; rateCross?: number }>;
  raif?: Array<{ cc?: string; ccy?: string; code?: string; buy: number | string | null; sale: number | string | null }>;
  oschad?: Array<{ cc?: string; ccy?: string; code?: string; buy: number | string | null; sale: number | string | null }>;
  pumb?: Array<{ cc?: string; ccy?: string; code?: string; buy: number | string | null; sale: number | string | null }>;
  sources?: Record<string, SourceMeta | { ok: boolean; source: string; count: number; updatedAt: string | null }>;
  updatedAt?: string;
}

export interface NormalizedRate {
  bankId: string;
  bankName: string;
  bankLogo: string;
  code: string;
  buy: number | null;
  sell: number | null;
  nbu: number | null;
  updatedAt: string | null;
  source: "bank" | "nbu";
}

const bankNames = new Map<string, string>(BANKS.map((b) => [b.id, b.name]));
export const bankLogos = new Map<string, string>(BANKS.map((b) => [b.id, b.logo]));

export const formatRate = (value: number | null | undefined, decimals = 2): string => {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return value.toFixed(decimals);
};

export const formatDateTime = (value?: string | null, locale = "uk-UA"): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const getNbuRate = (data: RawRatesResponse | null, code: string): number | null => {
  const match = data?.nbu?.find((rate) => rate.cc === code);
  return sanitizeNumber(match?.rate);
};

export const normalizeRates = (data: RawRatesResponse | null): NormalizedRate[] => {
  if (!data) return [];

  const rows: NormalizedRate[] = [];

  const pushRate = (
    bankId: string,
    code: string | null | undefined,
    rawBuy: unknown,
    rawSell: unknown,
    source: "bank" | "nbu" = "bank",
  ) => {
    if (!code || !CURRENCY_NAMES[code]) return;
    const validated = validateBankRatePair(code, rawBuy, rawSell);
    if (!validated.valid && source !== "nbu") return;

    rows.push({
      bankId,
      bankName: bankNames.get(bankId) || bankId,
      bankLogo: bankLogos.get(bankId) || "/logos/nbu.svg",
      code,
      buy: validated.sanitizedBuy,
      sell: validated.sanitizedSell,
      nbu: getNbuRate(data, code),
      updatedAt: data.updatedAt || null,
      source,
    });
  };

  // PrivatBank
  data.privat?.forEach((rate) => {
    pushRate("privat", rate.ccy, rate.buy, rate.sale);
  });

  // monobank
  data.mono?.forEach((rate) => {
    if (rate.currencyCodeB === 980) {
      const code = CURRENCY_MAP[rate.currencyCodeA];
      if (code) {
        const buy = rate.rateBuy ?? rate.rateCross;
        const sell = rate.rateSell ?? rate.rateCross;
        pushRate("mono", code, buy, sell);
      }
    }
  });

  // Raiffeisen, Oschadbank, PUMB
  (["raif", "oschad", "pumb"] as const).forEach((bankId) => {
    data[bankId]?.forEach((rate) => {
      const code = rate.cc || rate.ccy || rate.code;
      pushRate(bankId, code, rate.buy, rate.sale);
    });
  });

  // NBU
  data.nbu?.forEach((rate) => {
    if (["USD", "EUR", "PLN", "GBP", "CHF"].includes(rate.cc)) {
      pushRate("nbu", rate.cc, rate.rate, rate.rate, "nbu");
    }
  });

  return rows;
};

export interface BestRatesResult {
  bestBuy: NormalizedRate | null;
  bestSell: NormalizedRate | null;
}

export const getBestRates = (rates: NormalizedRate[], code: string): BestRatesResult => {
  const bankRates = rates.filter((rate) => rate.code === code && rate.bankId !== "nbu");

  // Best buy: highest buy rate offered by a bank (bank buys at highest price)
  const bestBuy = bankRates.reduce<NormalizedRate | null>((best, rate) => {
    if (rate.buy === null) return best;
    if (!best || best.buy === null || rate.buy > best.buy) return rate;
    return best;
  }, null);

  // Best sell: lowest sell rate offered by a bank (bank sells to customer at lowest price)
  const bestSell = bankRates.reduce<NormalizedRate | null>((best, rate) => {
    if (rate.sell === null) return best;
    if (!best || best.sell === null || rate.sell < best.sell) return rate;
    return best;
  }, null);

  return { bestBuy, bestSell };
};

export interface ConversionResult {
  result: number | null;
  rate: number | null;
  bankName: string;
  mode: "buy" | "sell" | "identical" | "cross";
}

export const convertCurrency = (
  amount: number,
  from: string,
  to: string,
  rates: NormalizedRate[],
  preferredBank = "best",
): ConversionResult => {
  if (amount <= 0 || Number.isNaN(amount)) {
    return { result: 0, rate: null, bankName: "", mode: "identical" };
  }
  if (from === to) {
    return { result: amount, rate: 1, bankName: "", mode: "identical" };
  }

  // Cross rates through UAH if neither is UAH
  if (from !== "UAH" && to !== "UAH") {
    const toUah = convertCurrency(amount, from, "UAH", rates, preferredBank);
    if (toUah.result === null) return { result: null, rate: null, bankName: "", mode: "cross" };
    return convertCurrency(toUah.result, "UAH", to, rates, preferredBank);
  }

  const targetCurrency = from === "UAH" ? to : from;
  const candidates = rates.filter(
    (rate) =>
      rate.code === targetCurrency &&
      (preferredBank === "best" ? rate.bankId !== "nbu" : rate.bankId === preferredBank),
  );

  let selected: NormalizedRate | null = null;

  if (preferredBank === "best") {
    if (from === "UAH") {
      // User has UAH, wants foreign currency -> Bank SELLS to user -> Choose lowest SELL rate
      selected = candidates.reduce<NormalizedRate | null>((best, r) => {
        if (r.sell === null) return best;
        if (!best || best.sell === null || r.sell < best.sell) return r;
        return best;
      }, null);
    } else {
      // User has foreign currency, wants UAH -> Bank BUYS from user -> Choose highest BUY rate
      selected = candidates.reduce<NormalizedRate | null>((best, r) => {
        if (r.buy === null) return best;
        if (!best || best.buy === null || r.buy > best.buy) return r;
        return best;
      }, null);
    }
  } else {
    selected = candidates[0] || null;
  }

  if (!selected) {
    return { result: null, rate: null, bankName: "", mode: from === "UAH" ? "sell" : "buy" };
  }

  const rate = from === "UAH" ? selected.sell : selected.buy;
  if (!rate || rate <= 0) {
    return { result: null, rate: null, bankName: selected.bankName, mode: from === "UAH" ? "sell" : "buy" };
  }

  const result = from === "UAH" ? amount / rate : amount * rate;
  return {
    result: Math.round(result * 100) / 100,
    rate,
    bankName: selected.bankName,
    mode: from === "UAH" ? "sell" : "buy",
  };
};

export interface MarketInsight {
  currency: string;
  nbuRate: number | null;
  bestBuyRate: number | null;
  bestBuyBank: string | null;
  bestSellRate: number | null;
  bestSellBank: string | null;
  worstBuyRate: number | null;
  worstSellRate: number | null;
  avgBuyRate: number | null;
  avgSellRate: number | null;
  bestSpread: number | null;
  nbuDiffBuy: number | null;
  nbuDiffSell: number | null;
}

export const getMarketInsights = (rates: NormalizedRate[], code: string): MarketInsight => {
  const bankRates = rates.filter((r) => r.code === code && r.bankId !== "nbu");
  const nbuRate = rates.find((r) => r.code === code && r.bankId === "nbu")?.buy ?? null;

  const validBuys = bankRates.filter((r) => r.buy !== null) as Array<NormalizedRate & { buy: number }>;
  const validSells = bankRates.filter((r) => r.sell !== null) as Array<NormalizedRate & { sell: number }>;

  const bestBuy = validBuys.reduce<(typeof validBuys)[0] | null>((b, r) => (!b || r.buy > b.buy ? r : b), null);
  const worstBuy = validBuys.reduce<(typeof validBuys)[0] | null>((b, r) => (!b || r.buy < b.buy ? r : b), null);

  const bestSell = validSells.reduce<(typeof validSells)[0] | null>((b, r) => (!b || r.sell < b.sell ? r : b), null);
  const worstSell = validSells.reduce<(typeof validSells)[0] | null>((b, r) => (!b || r.sell > b.sell ? r : b), null);

  const avgBuy = validBuys.length ? validBuys.reduce((sum, r) => sum + r.buy, 0) / validBuys.length : null;
  const avgSell = validSells.length ? validSells.reduce((sum, r) => sum + r.sell, 0) / validSells.length : null;

  const bestSpread =
    bestSell && bestBuy ? Math.round((bestSell.sell - bestBuy.buy) * 100) / 100 : null;

  const nbuDiffBuy =
    bestBuy && nbuRate ? Math.round((bestBuy.buy - nbuRate) * 100) / 100 : null;
  const nbuDiffSell =
    bestSell && nbuRate ? Math.round((bestSell.sell - nbuRate) * 100) / 100 : null;

  return {
    currency: code,
    nbuRate,
    bestBuyRate: bestBuy?.buy ?? null,
    bestBuyBank: bestBuy?.bankName ?? null,
    bestSellRate: bestSell?.sell ?? null,
    bestSellBank: bestSell?.bankName ?? null,
    worstBuyRate: worstBuy?.buy ?? null,
    worstSellRate: worstSell?.sell ?? null,
    avgBuyRate: avgBuy ? Math.round(avgBuy * 100) / 100 : null,
    avgSellRate: avgSell ? Math.round(avgSell * 100) / 100 : null,
    bestSpread,
    nbuDiffBuy,
    nbuDiffSell,
  };
};

export const getSourceSummary = (data: RawRatesResponse | null) => {
  const sources = data?.sources;
  return BANKS.map((bank) => {
    const rawRows = data?.[bank.id as keyof RawRatesResponse];
    const sourceEntry = sources?.[bank.id];
    const count =
      typeof sourceEntry === "object" && "count" in sourceEntry
        ? sourceEntry.count
        : Array.isArray(rawRows)
          ? rawRows.length
          : 0;
    const ok =
      typeof sourceEntry === "object" && "status" in sourceEntry
        ? sourceEntry.status !== "unavailable"
        : typeof sourceEntry === "object" && "ok" in sourceEntry
          ? (sourceEntry as { ok: boolean }).ok
          : count > 0;
    const updatedAt =
      typeof sourceEntry === "object" && "sourceUpdatedAt" in sourceEntry
        ? sourceEntry.sourceUpdatedAt
        : typeof sourceEntry === "object" && "updatedAt" in sourceEntry
          ? (sourceEntry as { updatedAt: string | null }).updatedAt
          : data?.updatedAt ?? null;

    return {
      ...bank,
      ok,
      count,
      updatedAt,
    };
  });
};

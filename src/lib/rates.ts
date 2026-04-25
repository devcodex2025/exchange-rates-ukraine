import { BANKS, CURRENCY_MAP, CURRENCY_NAMES } from "../constants";

export interface RawRatesResponse {
  base?: string;
  nbu?: any[];
  privat?: any[];
  mono?: any[];
  raif?: any[];
  oschad?: any[];
  pumb?: any[];
  sources?: Record<string, { ok: boolean; source: string; count: number; updatedAt: string | null }>;
  updatedAt?: string;
}

export interface NormalizedRate {
  bankId: string;
  bankName: string;
  code: string;
  buy: number | null;
  sell: number | null;
  nbu: number | null;
  updatedAt: string | null;
  source: "bank" | "nbu";
}

const bankNames = new Map<string, string>(BANKS.map((bank) => [bank.id, bank.name]));
export const bankLogos = new Map<string, string>(BANKS.map((bank) => [bank.id, bank.logo]));

const asNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatRate = (value: number | null | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? value.toFixed(2) : "—";

export const formatDateTime = (value?: string | null, locale = "uk-UA") => {
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
  return asNumber(match?.rate);
};

export const normalizeRates = (data: RawRatesResponse | null): NormalizedRate[] => {
  if (!data) return [];

  const rows: NormalizedRate[] = [];
  const pushRate = (
    bankId: string,
    code: string | null,
    buy: unknown,
    sell: unknown,
    source: "bank" | "nbu" = "bank",
  ) => {
    if (!code || !CURRENCY_NAMES[code]) return;
    rows.push({
      bankId,
      bankName: bankNames.get(bankId) || bankId,
      code,
      buy: asNumber(buy),
      sell: asNumber(sell),
      nbu: getNbuRate(data, code),
      updatedAt: data.updatedAt || null,
      source,
    });
  };

  data.privat
    ?.filter((rate) => ["USD", "EUR"].includes(rate.ccy))
    .forEach((rate) => pushRate("privat", rate.ccy, rate.buy, rate.sale));

  data.mono
    ?.filter((rate) => rate.currencyCodeB === 980 && CURRENCY_MAP[rate.currencyCodeA])
    .forEach((rate) => pushRate("mono", CURRENCY_MAP[rate.currencyCodeA], rate.rateBuy, rate.rateSell));

  (["raif", "oschad", "pumb"] as const).forEach((bankId) => {
    data[bankId]?.forEach((rate) => pushRate(bankId, rate.cc || rate.ccy || rate.code, rate.buy, rate.sale));
  });

  data.nbu
    ?.filter((rate) => ["USD", "EUR", "PLN", "GBP"].includes(rate.cc))
    .forEach((rate) => pushRate("nbu", rate.cc, rate.rate, rate.rate, "nbu"));

  return rows;
};

export const getSourceSummary = (data: RawRatesResponse | null) => {
  const sources = data?.sources;
  return BANKS.map((bank) => {
    const rawRows = data?.[bank.id as keyof RawRatesResponse];
    const count = sources?.[bank.id]?.count ?? (Array.isArray(rawRows) ? rawRows.length : 0);
    return {
      ...bank,
      ok: sources?.[bank.id]?.ok ?? count > 0,
      count,
      updatedAt: sources?.[bank.id]?.updatedAt ?? data?.updatedAt ?? null,
    };
  });
};

export const getBestRates = (rates: NormalizedRate[], code: string) => {
  const bankRates = rates.filter((rate) => rate.code === code && rate.bankId !== "nbu");
  const bestBuy = bankRates.reduce<NormalizedRate | null>(
    (best, rate) => (rate.buy !== null && (!best || rate.buy > (best.buy ?? 0)) ? rate : best),
    null,
  );
  const bestSell = bankRates.reduce<NormalizedRate | null>(
    (best, rate) => (rate.sell !== null && (!best || rate.sell < (best.sell ?? Infinity)) ? rate : best),
    null,
  );

  return { bestBuy, bestSell };
};

export const convertCurrency = (
  amount: number,
  from: string,
  to: string,
  rates: NormalizedRate[],
  preferredBank = "best",
) => {
  if (!amount || from === to) return { result: amount || 0, rate: 1, bankName: "" };
  if (from !== "UAH" && to !== "UAH") return { result: null, rate: null, bankName: "" };

  const targetCode = from === "UAH" ? to : from;
  const candidates = rates.filter(
    (rate) =>
      rate.code === targetCode &&
      (preferredBank === "best" ? rate.bankId !== "nbu" : rate.bankId === preferredBank),
  );
  const selected =
    preferredBank === "best"
      ? from === "UAH"
        ? candidates.reduce<NormalizedRate | null>(
            (best, rate) => (rate.sell !== null && (!best || rate.sell < (best.sell ?? Infinity)) ? rate : best),
            null,
          )
        : candidates.reduce<NormalizedRate | null>(
            (best, rate) => (rate.buy !== null && (!best || rate.buy > (best.buy ?? 0)) ? rate : best),
            null,
          )
      : candidates[0];

  if (!selected) return { result: null, rate: null, bankName: "" };

  const rate = from === "UAH" ? selected.sell : selected.buy;
  if (!rate) return { result: null, rate: null, bankName: selected.bankName };

  return {
    result: from === "UAH" ? amount / rate : amount * rate,
    rate,
    bankName: selected.bankName,
  };
};

export const SUPPORTED_CURRENCIES = ["USD", "EUR", "PLN", "GBP", "CHF"] as const;
export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const isSupportedCurrency = (code: string): code is SupportedCurrency => {
  return SUPPORTED_CURRENCIES.includes(code as SupportedCurrency);
};

export const sanitizeNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = typeof value === "number" ? value : Number.parseFloat(String(value).replace(",", "."));
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.round(num * 10000) / 10000;
};

// Plausible exchange rate bounds to guard against parsing artifacts or corrupted HTML feeds
const RATE_BOUNDS: Record<SupportedCurrency, { min: number; max: number }> = {
  USD: { min: 25, max: 90 },
  EUR: { min: 30, max: 100 },
  PLN: { min: 6, max: 25 },
  GBP: { min: 35, max: 120 },
  CHF: { min: 30, max: 120 },
};

export const isValidRateValue = (code: string, value: number | null): boolean => {
  if (value === null || !Number.isFinite(value) || value <= 0) return false;
  if (!isSupportedCurrency(code)) return true; // allow unknown currencies if valid positive number
  const bounds = RATE_BOUNDS[code];
  return value >= bounds.min && value <= bounds.max;
};

export interface BankRateValidationResult {
  valid: boolean;
  sanitizedBuy: number | null;
  sanitizedSell: number | null;
  reason?: string;
}

export const validateBankRatePair = (
  code: string,
  rawBuy: unknown,
  rawSell: unknown,
): BankRateValidationResult => {
  const buy = sanitizeNumber(rawBuy);
  const sell = sanitizeNumber(rawSell);

  if (buy === null && sell === null) {
    return { valid: false, sanitizedBuy: null, sanitizedSell: null, reason: "Both buy and sell rates are missing" };
  }

  const validBuy = buy !== null ? isValidRateValue(code, buy) : true;
  const validSell = sell !== null ? isValidRateValue(code, sell) : true;

  if (!validBuy || !validSell) {
    return {
      valid: false,
      sanitizedBuy: validBuy ? buy : null,
      sanitizedSell: validSell ? sell : null,
      reason: "Rate values out of reasonable market bounds",
    };
  }

  // Sanity check: Buy rate should not be astronomically higher than sell rate
  if (buy !== null && sell !== null && buy > sell * 1.25) {
    return {
      valid: false,
      sanitizedBuy: null,
      sanitizedSell: null,
      reason: "Inverted rate pair: buy rate significantly exceeds sell rate",
    };
  }

  return {
    valid: true,
    sanitizedBuy: buy,
    sanitizedSell: sell,
  };
};

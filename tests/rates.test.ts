import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateBankRatePair,
  sanitizeNumber,
  isValidRateValue,
} from "../src/lib/rates/validation";
import {
  normalizeRates,
  getBestRates,
  convertCurrency,
  getMarketInsights,
  NormalizedRate,
} from "../src/lib/rates/normalize";

describe("Rate validation", () => {
  it("sanitizes numbers correctly", () => {
    assert.equal(sanitizeNumber(41.5), 41.5);
    assert.equal(sanitizeNumber("41,50"), 41.5);
    assert.equal(sanitizeNumber("41.7500"), 41.75);
    assert.equal(sanitizeNumber(0), null);
    assert.equal(sanitizeNumber(-10), null);
    assert.equal(sanitizeNumber(null), null);
    assert.equal(sanitizeNumber(undefined), null);
  });

  it("checks rate bounds for USD and EUR", () => {
    assert.equal(isValidRateValue("USD", 41.5), true);
    assert.equal(isValidRateValue("USD", 10.0), false); // too low
    assert.equal(isValidRateValue("USD", 120.0), false); // too high
    assert.equal(isValidRateValue("EUR", 45.0), true);
  });

  it("validates bank rate pairs", () => {
    const valid = validateBankRatePair("USD", 41.2, 41.7);
    assert.equal(valid.valid, true);
    assert.equal(valid.sanitizedBuy, 41.2);
    assert.equal(valid.sanitizedSell, 41.7);

    const inverted = validateBankRatePair("USD", 60.0, 40.0);
    assert.equal(inverted.valid, false);
  });
});

describe("Rate Normalization and Calculations", () => {
  const sampleRates: NormalizedRate[] = [
    {
      bankId: "privat",
      bankName: "PrivatBank",
      bankLogo: "/logos/privat.svg",
      code: "USD",
      buy: 41.1,
      sell: 41.6,
      nbu: 41.35,
      updatedAt: "2026-11-09T00:00:00Z",
      source: "bank",
    },
    {
      bankId: "mono",
      bankName: "monobank",
      bankLogo: "/logos/mono.svg",
      code: "USD",
      buy: 41.25,
      sell: 41.55,
      nbu: 41.35,
      updatedAt: "2026-11-09T00:00:00Z",
      source: "bank",
    },
    {
      bankId: "pumb",
      bankName: "PUMB",
      bankLogo: "/logos/pumb.svg",
      code: "USD",
      buy: 41.0,
      sell: 41.7,
      nbu: 41.35,
      updatedAt: "2026-11-09T00:00:00Z",
      source: "bank",
    },
    {
      bankId: "nbu",
      bankName: "NBU",
      bankLogo: "/logos/nbu.svg",
      code: "USD",
      buy: 41.35,
      sell: 41.35,
      nbu: 41.35,
      updatedAt: "2026-11-09T00:00:00Z",
      source: "nbu",
    },
  ];

  it("calculates best buy and best sell rates independently", () => {
    const { bestBuy, bestSell } = getBestRates(sampleRates, "USD");
    // Best buy: highest price bank buys at -> monobank (41.25)
    assert.equal(bestBuy?.bankId, "mono");
    assert.equal(bestBuy?.buy, 41.25);

    // Best sell: lowest price bank sells at -> monobank (41.55)
    assert.equal(bestSell?.bankId, "mono");
    assert.equal(bestSell?.sell, 41.55);
  });

  it("converts currency accurately according to buy/sell sides", () => {
    // 1000 UAH to USD -> Bank sells USD to user at 41.55 (mono)
    const convToUsd = convertCurrency(1000, "UAH", "USD", sampleRates, "best");
    assert.equal(convToUsd.mode, "sell");
    assert.equal(convToUsd.rate, 41.55);
    assert.equal(convToUsd.result, 24.07);

    // 100 USD to UAH -> Bank buys USD from user at 41.25 (mono)
    const convToUah = convertCurrency(100, "USD", "UAH", sampleRates, "best");
    assert.equal(convToUah.mode, "buy");
    assert.equal(convToUah.rate, 41.25);
    assert.equal(convToUah.result, 4125);
  });

  it("calculates market insights correctly", () => {
    const insights = getMarketInsights(sampleRates, "USD");
    assert.equal(insights.nbuRate, 41.35);
    assert.equal(insights.bestBuyRate, 41.25);
    assert.equal(insights.bestBuyBank, "monobank");
    assert.equal(insights.bestSellRate, 41.55);
    assert.equal(insights.bestSellBank, "monobank");
    assert.equal(insights.bestSpread, 0.3); // 41.55 - 41.25 = 0.30
  });
});

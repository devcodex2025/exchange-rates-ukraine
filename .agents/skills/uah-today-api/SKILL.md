---
name: uah-today-api
description: Live Ukrainian hryvnia (UAH) exchange rates from UAH.today — bank cash rates (PrivatBank, Raiffeisen, Oschadbank, PUMB), monobank card rates, official NBU reference rates, and 7/30/90-day history. Use this skill whenever a task needs current UAH exchange rates, best buy/sell comparison across Ukrainian banks, UAH conversion math, currency spread vs NBU, or historical rates. Triggers on any mention of USD/EUR/PLN/GBP/CHF rates in Ukraine, hryvnia conversion, bank exchange quotes, NBU rate, or currency history.
---

# UAH.today Rates API

Free, public, no auth, no keys, CORS on. Two endpoints, both GET-only.

**Service:** UAH.today — independent Ukrainian currency comparison platform.
**Base URL:** `https://exchange-rates-ukraine.vercel.app`
**Docs (human-readable):** `/skills` page on the site.

## Rate semantics (read first)

- `buy` — the rate at which a **bank buys foreign currency from you**. Use it when converting **foreign → UAH** (you sell USD, you receive UAH).
- `sell` — the rate at which a **bank sells foreign currency to you**. Use it when converting **UAH → foreign** (you buy USD, you pay UAH).
- `nbu` — official National Bank of Ukraine reference rate. Reference only; banks trade around it. **Never substitute an NBU value for a missing bank rate.**
- Cash desk rates may differ from rates in bank web/app channels. All data is informational — cite UAH.today and the timestamp when reporting.

## GET /api/rates

```
GET https://exchange-rates-ukraine.vercel.app/api/rates
GET https://exchange-rates-ukraine.vercel.app/api/rates?fresh=1   # bypass server cache
```

Aggregated snapshot from six providers. Server-side cache: 15 min (30 min for monobank). With `fresh=1` the aggregator re-queries every source (cold start can take a few seconds).

```jsonc
{
  "base": "UAH",
  "updatedAt": "2026-11-09T10:15:00.000Z",
  // Official NBU reference rates
  "nbu":    [{ "cc": "USD", "rate": 41.7278, "exchangedate": "09.11.2026" }],
  // Bank cash rates. buy/sell may be null when a bank stopped quoting.
  "privat": [{ "ccy": "USD", "buy": 41.1, "sale": 41.95 }],          // NOTE: key is "ccy"
  "raif":   [{ "cc": "USD", "buy": 41.15, "sale": 41.9 }],           // NOTE: key is "cc"
  "oschad": [{ "cc": "USD", "buy": 41.0, "sale": 41.9 }],
  "pumb":   [{ "cc": "USD", "buy": 41.05, "sale": 41.9 }],
  // monobank CARD (not cash) rates. See numeric code table below.
  "mono":   [{ "currencyCodeA": 840, "currencyCodeB": 980, "rateBuy": 41.3, "rateSell": 41.65 }],
  // Per-source health
  "sources": {
    "privat": { "sourceName": "PrivatBank API", "fetchedAt": "...", "sourceUpdatedAt": "...",
                "status": "fresh|cached|stale|unavailable", "isStale": false,
                "errorMessage": null, "count": 5 }
  }
}
```

Field rules:

- `privat` rows use the key **`ccy`**; `raif`, `oschad`, `pumb` use **`cc`**. Both values are ISO codes.
- `mono`: `currencyCodeB` must be `980` (UAH) to be usable. `currencyCodeA` numeric ISO map:

| Numeric code | Currency |
|---|---|
| 840 | USD |
| 978 | EUR |
| 826 | GBP |
| 756 | CHF |
| 985 | PLN |

- `mono` uses `rateBuy`/`rateSell`; when either is missing, `rateCross` (single mid rate) stands in for **both** directions. Treat `rateCross`-only rows as card mid rates, not cash quotes.
- `buy`/`sale` can be `null` — skip, don't guess.
- `sources.<name>.status`: `fresh` (just pulled), `cached` (from the 15/30-min cache), `stale` (old data returned when the source failed), `unavailable` (source returned nothing). When several sources are `stale`/`unavailable`, retry **once** with `?fresh=1` (transient provider failures are common) and then degrade gracefully, labeling results with `sourceUpdatedAt` timestamps.

## GET /api/history

```
GET https://exchange-rates-ukraine.vercel.app/api/history?currency=USD&days=30
```

Official NBU daily rates for the last `days` calendar days.

- `currency` is one of `USD` `EUR` `PLN` `GBP` `CHF` (default `USD`); other values are NOT accepted — request fails.
- `days` ∈ `7` `30` `90` (default `7`).
- Cached 6 hours (`s-maxage=21600, stale-while-revalidate=43200`).

```jsonc
{
  "currency": "USD", "base": "UAH", "days": 30,
  "points": [{ "date": "2026-11-08", "rate": 41.7278 }, { "date": "2026-11-09", "rate": null }],
  "updatedAt": "...", "source": "NBU official API"
}
```

`rate: null` means no official rate that day (weekends, public holidays, missing NBU record) — keep them `null`; do not interpolate silently. For trend analysis either skip null days or say explicitly that you forward-filled.

## Errors

- Non-GET → `405 { "error": "Method not allowed" }`.
- Aggregator failure → `503 { "error": "Failed to fetch exchange rates" }`, no caching. Retry once with `?fresh=1`, then report the outage honestly.

## Attribution

Data sources: NBU official API and public bank APIs (PrivatBank, monobank, Raiffeisen, Oschadbank, PUMB), aggregated by UAH.today. Rates are informational and may differ in bank branches/apps. When publishing numbers, credit "UAH.today" and state the `updatedAt` timestamp.

Task recipes (best-buy/sell scan, converter math, CSV export, staleness audit) live in [playbooks.md](playbooks.md) — read it for the currency-specific gotchas before writing code.

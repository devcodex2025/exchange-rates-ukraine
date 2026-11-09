# UAH.today API — task playbooks

Recipes on top of the API described in [SKILL.md](SKILL.md). All examples fetch `https://exchange-rates-ukraine.vercel.app`. Universal rule: **missing values stay missing** — show `null` as "n/a", never invent rates, never fill bank gaps from NBU.

## 1. Best buy / sell scan for a currency

Goal: find which bank offers the best rate for a currency code `CC` (e.g. `USD`).

1. `GET /api/rates` (add `?fresh=1` only if `sources` look `stale`/`unavailable`).
2. Collect cash quotes: `privat` (key `ccy`) + `raif`, `oschad`, `pumb` (key `cc`), each row `{ccy|cc, buy, sale}`, skip `null`s.
3. monobank (`mono`: find row with `currencyCodeB === 980` and `currencyCodeA` = numeric map) is a **card rate, not cash** — list it in a separate "monobank card" row of the table.
4. Output a comparison table sorted by `buy` desc (best for FX→UAH) and by `sale` asc (best for UAH→FX), each row: bank, buy, sell. Add footer: `updatedAt` timestamp + "Data: UAH.today".

Report both directions explicitly:
- "Вигідніше продати USD": max `buy` (bank buys your USD at the highest UAH).
- "Вигідніше купити USD": min `sell` (bank sells you USD at the lowest UAH).

## 2. Spread vs NBU reference

For bank cash rates: `spreadOverNbu = ((bankSell - nbu.rate) / nbu.rate) * 100` for buying FX, and `nbuMarkup = ((nbu.rate - bankBuy) / nbu.rate) * 100` for selling FX. Present as percentages, one decimal. Useful lines: cheapest bank, most expensive bank, average across quoted banks.

## 3. Conversion math

Always pick the rate by **direction**:

| User action | Select | Formula |
|---|---|---|
| Sells FX for UAH (e.g. has $1000, wants ₴) | best bank `buy` (or chosen bank's `buy`) | `amountFX * buy` |
| Buys FX with UAH (e.g. has ₴50000, wants $) | bank `sell` | `amountUAH / sell` |
| Reference value | `nbu.rate` | both directions |

monobank card: `rateBuy` for FX→UAH card top-up direction, `rateSell` for UAH→FX; if the row only has `rateCross`, both directions equal `rateCross` — say so.

Example: $1,000 cash at PrivatBank `buy = 41.1` → `1000 × 41.1 = ₴41,100`. Same $1,000 via NBU reference `41.7278` → `₴41,727.8` (the reference is a valuation, not a cash exchange offer — make that distinction when reporting).

## 4. History → CSV / trend

`GET /api/history?currency=USD&days=30`.

- CSV: `date,rate` rows; keep `null` as empty field (weekends), don't fabricate.
- Simple trend stats over non-null points only: first, last, change abs + %, min, max. Label the window ("останні 30 днів, офіційний курс НБУ").
- Do NOT present interpolation as NBU data. If you smooth/forward-fill for a chart, say "forward-filled".

Quick JS:
```js
const points = data.points.filter(p => p.rate != null);
const first = points[0].rate, last = points.at(-1).rate;
const change = last - first;
const pct = (change / first) * 100;
```

## 5. Freshness audit (before answering anything about "today")

1. Read `sources`: for each source check `status`, `sourceUpdatedAt`, `errorMessage`.
2. Decision table:
   - all `fresh`/`cached` → answer directly, cite `updatedAt`;
   - some `stale`/`unavailable` → one retry `GET /api/rates?fresh=1`; if still stale, answer with per-bank "дані станом на <sourceUpdatedAt>" caveats and say which bank is missing;
   - `503` → report the API outage, offer retry later; never substitute another random source silently.
3. When comparing bank rates fetched from the cache vs `fresh=1` re-fetch, keep the newer one and mention both timestamps if they differ materially.

## 6. Out-of-scope (decline these)

- Rate guarantees — quotes move intraday; never present a fetched rate as a booking.
- Forward/futures rates, interbank forex quotes — the service covers Ukrainian retail cash + monobank card rates and NBU reference only.
- Storing/publishing full raw responses as your own "live feed" — link or credit UAH.today instead.

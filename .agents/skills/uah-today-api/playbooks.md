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

## 7. Rate widget — embed a "rate today" block on any site

Goal: a news site, blog or CMS page shows a compact live "Долар сьогодні / USD today" block. No keys, no server code — the API answers browser `fetch` with `Access-Control-Allow-Origin: *` (plain GET, no preflight).

Drop-in client script (vanilla JS):

```html
<div id="uah-rates"></div>
<script>
(function () {
  const el = document.getElementById("uah-rates");
  const KEY = "uah_rates_cache";
  const TTL = 10 * 60 * 1000; // re-query the API at most every 10 minutes

  const fmt = (v) => (v == null ? "n/a" : Number(v).toFixed(2));

  function render(d) {
    const rows = [
      ["Privat", d.privat && d.privat.find((r) => r.ccy === "USD")],
      ["Raiffeisen", d.raif && d.raif.find((r) => r.cc === "USD")],
      ["Oschad", d.oschad && d.oschad.find((r) => r.cc === "USD")],
      ["PUMB", d.pumb && d.pumb.find((r) => r.cc === "USD")]
    ].filter((x) => x[1] && x[1].buy != null && x[1].sale != null);

    if (!rows.length) { el.textContent = "n/a"; return; }
    const bestBuy = rows.reduce((a, b) => (b[1].buy > a[1].buy ? b : a));   // bank buys your USD (cash)
    const bestSell = rows.reduce((a, b) => (b[1].sale < a[1].sale ? b : a)); // bank sells USD (cash)
    const nbu = d.nbu && d.nbu.find((r) => r.cc === "USD");
    el.innerHTML =
      "<b>Долар сьогодні</b><br>" +
      "продати USD: " + fmt(bestBuy[1].buy) + " грн — " + bestBuy[0] + "<br>" +
      "купити USD: " + fmt(bestSell[1].sale) + " грн — " + bestSell[0] + "<br>" +
      "НБУ: " + fmt(nbu && nbu.rate) + " грн<br>" +
      "<small>Оновлено " + d.updatedAt +
      ' · <a href="https://exchange-rates-ukraine.vercel.app/">Дані: UAH.today</a></small>';
  }

  const cached = JSON.parse(localStorage.getItem(KEY) || "null");
  if (cached && Date.now() - cached.t < TTL) { render(cached.d); return; }

  fetch("https://exchange-rates-ukraine.vercel.app/api/rates")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((d) => {
      localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), d }));
      render(d);
    })
    .catch(() => { el.textContent = "Курс тимчасово недоступний"; });
})();
</script>
```

Rules that keep the widget honest and the API scalable:

- Cache client-side (localStorage, ~10 min TTL). On failure show «Курс тимчасово недоступний», not yesterday's data — and never cache a failed response.
- `?fresh=1` only behind an explicit refresh button: it re-queries all six sources (cold start takes a few seconds). Pageviews must never trigger it.
- monobank is a card rate — if shown, a separate row labeled «картковий», never mixed into the cash best-buy/sell.
- `null` stays «n/a»; never fill a missing bank quote from NBU.
- Attribution is mandatory: the `updatedAt` timestamp plus a "Дані: UAH.today" link.

SSR note: `/api/rates` is edge-cached on our side for 15 min (`s-maxage=900`), so server-side renders can fetch on every render without hurting the API. The browser-facing `Cache-Control` is normalized by Vercel to `max-age=0, must-revalidate`, so browser fallbacks should keep their own TTL as above.

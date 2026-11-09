# UAH.today — Ukrainian Currency Exchange Comparison Platform

[![CI Quality & Build](https://github.com/devcodex2025/exchange-rates-ukraine/actions/workflows/ci.yml/badge.svg)](https://github.com/devcodex2025/exchange-rates-ukraine/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Production](https://img.shields.io/badge/Production-Live-emerald.svg)](https://exchange-rates-ukraine.vercel.app/)

**UAH.today** is a modern, high-performance currency comparison platform that helps people find the best exchange rates across Ukrainian banks and the National Bank of Ukraine (NBU).

---

## 1. Product Purpose & Identity

**UAH.today — Find the best exchange rate in Ukraine.**

The platform answers three vital questions for consumers and businesses:
1. **Where can I buy foreign currency at the best price?**
2. **Where can I sell foreign currency at the best price?**
3. **How much will my money be worth when converted between different institutions?**

---

## 2. Unique Value Proposition (USP)

- **Best Rate Finder**: Automatically identifies the best available retail buy and sell rates across supported banks independently (avoiding confusing single-bank conflations).
- **Real-time Bank Comparison**: Transparent side-by-side comparison across top Ukrainian financial institutions with explicit timestamps and freshness states.
- **Smart Currency Converter**: Instantly computes bidirectional exchange using the best available bank rate or a customer-selected bank.
- **Transparent Data Sources**: Every quote is tagged with its origin provider, fetch timestamp, and freshness status. Never fabricates numbers or substitutes missing values with zeroes.
- **Currency Market Insights**: Live spread calculations, variance ranges, and deviation from the official NBU central bank rate.
- **Speed & Privacy**: Mobile-first architecture, no mandatory login or personal telemetry, WCAG 2.2 AA accessibility, and instant navigation.

---

## 3. Supported Currencies & Institutions

### Supported Currencies
- **USD** — US Dollar ($)
- **EUR** — Euro (€)
- **PLN** — Polish Zloty (zł)
- **GBP** — British Pound (£)
- **CHF** — Swiss Franc (Fr)

### Supported Institutions
- **National Bank of Ukraine (NBU)** — Official central bank benchmark API
- **PrivatBank** — Official public exchange API
- **monobank** — Verified official retail API
- **Raiffeisen Bank** — Real-time bank feed
- **Oschadbank** — Real-time bank feed
- **PUMB** — Real-time bank feed

---

## 4. Architecture Overview

```
├── api/                           # Vercel Serverless Functions
│   ├── rates.ts                   # /api/rates endpoint with CDN caching
│   └── history.ts                 # /api/history NBU historical archive endpoint
├── src/
│   ├── components/                # React UI Components
│   │   ├── BestRateFinder.tsx     # Top buy/sell rate comparison widget
│   │   ├── CurrencyCard.tsx       # Currency overview cards
│   │   ├── CurrencyConverter.tsx  # Smart bidirectional converter
│   │   ├── MarketInsights.tsx     # Spreads, variance and NBU difference
│   │   ├── RatesTable.tsx         # Sortable, searchable comparison table
│   │   ├── EditorialContent.tsx   # Topic-specific SEO guides
│   │   ├── CookieConsent.tsx      # GDPR & AdSense compliant consent banner
│   │   ├── AdSlot.tsx             # Non-intrusive AdSense ready slot
│   │   └── ui/                    # Reusable primitive UI components
│   ├── lib/
│   │   └── rates/
│   │       ├── normalize.ts       # Rate normalization & conversions
│   │       └── validation.ts      # Number sanitation & rate bounds check
│   ├── pages/                     # Routed pages (UA & EN)
│   │   ├── Dashboard.tsx          # Main high-performance dashboard
│   │   ├── About.tsx              # About Us & methodology
│   │   ├── Contact.tsx            # Contact information & editorial form
│   │   ├── PrivacyPolicy.tsx      # Detailed GDPR & AdSense policy
│   │   └── Terms.tsx              # Terms of Use & legal disclaimer
│   ├── services/
│   │   ├── cache/
│   │   │   └── cache.service.ts   # In-memory deduplicating cache
│   │   └── rates/                 # Isolated bank provider clients
│   │       ├── nbu.service.ts
│   │       ├── privatbank.service.ts
│   │       ├── monobank.service.ts
│   │       ├── raiffeisen.service.ts
│   │       ├── oschadbank.service.ts
│   │       ├── pumb.service.ts
│   │       └── rates-aggregator.service.ts
│   ├── constants.ts               # Localized copy, currencies & bank metadata
│   └── index.css                  # Tailwind CSS styling
├── scripts/
│   ├── check-i18n.mjs             # Automated localization leak test
│   └── prerender.mjs              # SSG generator for 22 indexable routes
└── tests/
    └── rates.test.ts              # Unit tests for calculations & validation
```

---

## 5. Technology Stack

- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS v4, Lucide Icons, Recharts
- **Build & Bundle**: Vite 6, Static Prerendering (SSG)
- **Backend / API**: Express 4, Node.js 22, Vercel Serverless Functions
- **Testing**: Node Native Test Runner, TSX, Vitest compatible
- **Deployment**: Vercel Edge Network with stale-while-revalidate caching

---

## 6. Installation & Development

### Prerequisites
- Node.js >= 20.0.0
- npm >= 9.0.0

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/devcodex2025/exchange-rates-ukraine.git
   cd exchange-rates-ukraine
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment (optional)**:
   ```bash
   cp .env.example .env
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Run test suite**:
   ```bash
   npm test
   npm run check:i18n
   npm run lint
   ```

6. **Build for production with Prerendering (SSG)**:
   ```bash
   npm run build
   ```

---

## 7. Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_SITE_URL` | Canonical origin URL for SEO & sitemaps | `https://exchange-rates-ukraine.vercel.app` |
| `PORT` | Local dev server port | `3000` |

---

## 8. Machine-Readable API & Open Data

UAH.today provides open endpoints for search crawlers, research, and AI integrations:

### 1. `GET /api/rates` (or `/rates.json`)
Returns real-time aggregated rates across all supported banks.

**Response Structure:**
```json
{
  "base": "UAH",
  "updatedAt": "2026-11-09T03:30:00.000Z",
  "nbu": [
    { "cc": "USD", "rate": 41.35 }
  ],
  "privat": [
    { "ccy": "USD", "buy": 41.10, "sale": 41.60 }
  ],
  "mono": [
    { "currencyCodeA": 840, "currencyCodeB": 980, "rateBuy": 41.25, "rateSell": 41.55 }
  ],
  "sources": {
    "privat": {
      "sourceName": "PrivatBank API",
      "status": "fresh",
      "isStale": false,
      "fetchedAt": "2026-11-09T03:30:00.000Z"
    }
  }
}
```

### 2. `GET /api/history?currency=USD&days=7`
Returns official NBU historical data points (7, 30, or 90 days).

### 3. `GET /llms.txt`
Structured reference guide for Large Language Models and AI agents.

---

## 9. Google AdSense & Policy Compliance

- **ads.txt**: Pre-configured in `/public/ads.txt`.
- **Consent Management**: Cookie consent banner configured with granular preferences and footer reset toggle.
- **Mandatory Disclosures**: Full Privacy Policy (`/privacy-policy` and `/en/privacy-policy`) disclosing third-party advertising cookies, server telemetry, and Google AdSense partner terms.
- **Ad Slot Placement**: Designed to prevent accidental clicks with clear "Реклама" / "Advertisement" labeling.

---

## 10. Contributing

Contributions are welcome! Please review [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

---

## 11. License

This project is open-source and distributed under the [MIT License](LICENSE).

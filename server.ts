import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
// First file wins per key; missing files are skipped silently, so production
// (Vercel has no local env files) is unaffected.
dotenv.config({ path: [".env.local", ".env"] });
import { RatesAggregatorService } from "./src/services/rates/rates-aggregator.service";
import contactHandler from "./api/contact";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// History cache
let historyCache: { [key: string]: { data: any; timestamp: number } } = {};
const HISTORY_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours for NBU historical data

const formatNbuDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

// API Routes
app.get("/api/history", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const currency = typeof req.query.currency === "string" ? req.query.currency.toUpperCase() : "USD";
  const requestedDays = Number.parseInt(String(req.query.days || "7"), 10);
  const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 7;
  const cacheKey = `history:${currency}:${days}`;
  const now = Date.now();

  if (historyCache[cacheKey] && now - historyCache[cacheKey].timestamp < HISTORY_CACHE_DURATION) {
    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=43200");
    return res.json(historyCache[cacheKey].data);
  }

  try {
    const today = new Date();
    const dates = Array.from({ length: days }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - index));
      return date;
    });

    const points = await Promise.all(
      dates.map(async (date) => {
        const nbuDate = formatNbuDate(date);
        try {
          const res = await fetch(
            `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&date=${nbuDate}&json`,
          );
          if (!res.ok) return { date: date.toISOString().slice(0, 10), rate: null };
          const data = await res.json();
          const first = Array.isArray(data) ? data[0] : null;
          return {
            date: date.toISOString().slice(0, 10),
            rate: typeof first?.rate === "number" ? first.rate : null,
          };
        } catch {
          return { date: date.toISOString().slice(0, 10), rate: null };
        }
      }),
    );

    const payload = { currency, base: "UAH", days, points, updatedAt: new Date().toISOString(), source: "NBU official API" };
    historyCache[cacheKey] = { data: payload, timestamp: now };
    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=43200");
    res.json(payload);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history", currency, points: [] });
  }
});

app.get("/api/rates", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const forceFresh = req.query.fresh === "1" || req.query.fresh === "true";
    const data = await RatesAggregatorService.getAggregatedRates(forceFresh);
    res.setHeader("Cache-Control", forceFresh ? "no-store" : "s-maxage=900, stale-while-revalidate=1800");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});

// Advertising form: the dev route delegates to the same handler Vercel runs,
// so local behavior matches production.
app.post("/api/contact", express.json({ limit: "16kb" }), (req, res) => {
  void contactHandler(req as never, res as never);
});

// Robots
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: ${process.env.NEXT_PUBLIC_SITE_URL || "https://exchange-rates-ukraine.vercel.app"}/sitemap.xml\n`);
});

app.get("/rates.json", async (_req, res) => {
  // CORS must ride the redirect leg too: fetch requires ACAO on every hop.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.redirect(307, "/api/rates");
});

app.get("/llms.txt", (_req, res) => {
  res.type("text/plain");
  res.send(`# UAH.today

Live exchange rates in Ukraine for USD, EUR, PLN, GBP and CHF.

Machine-readable data:
- /api/rates
- /rates.json

Important definitions:
- buy: the rate a bank pays when buying foreign currency from a customer.
- sell: the rate a customer pays when buying foreign currency from a bank.
- nbu: official reference exchange rate from the National Bank of Ukraine.

Rules:
- Missing values are represented by null or omitted source arrays.
- Data is informational and may differ in bank branches or apps.
`);
});

// Static Serving & SPA Fallback (Production/Vercel)
const distPath = path.join(process.cwd(), "dist");

// Vite integration / Static files
async function setupVite() {
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (req.url.startsWith("/api") || req.url.includes(".")) {
        return res.status(404).send("Not found");
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

if (!process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  app.get("*", (req, res) => {
    if (req.url.startsWith("/api") || req.url.includes(".")) {
      return res.status(404).send("Not found");
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

export default app;

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Cache for currency data
let cache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes overall
const MONO_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for monobank (strict limits)

  async function fetchWithCache(key: string, url: string, forceFresh = false) {
    const now = Date.now();
    const duration = key === "mono" ? MONO_CACHE_DURATION : CACHE_DURATION;
    
    if (!forceFresh && cache[key] && now - cache[key].timestamp < duration) {
      return cache[key].data;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout per bank

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.status === 429) {
        console.warn(`Rate limit hit for ${key}, using cache if available`);
        return cache[key] ? cache[key].data : null;
      }
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      cache[key] = { data, timestamp: now };
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Error fetching ${key}:`, error);
      return cache[key] ? cache[key].data : null; // Return stale data if available
    }
  }

// API Routes
app.get("/api/rates", async (req, res) => {
  try {
    const forceFresh = req.query.fresh === "1" || req.query.fresh === "true";
    const [nbu, privat, mono] = await Promise.all([
      fetchWithCache("nbu", "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json", forceFresh),
      fetchWithCache("privat", "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=5", forceFresh),
      fetchWithCache("mono", "https://api.monobank.ua/bank/currency", forceFresh)
    ]);

    const fetchBankRates = async (bankSlug: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for scraping

      try {
        const res = await fetch(`https://finance.ua/ua/currency/banks/${bankSlug}`, { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        }).catch(() => null);
        
        clearTimeout(timeoutId);

        if (res && res.ok) {
          const html = await res.text();
          const usdMatch = html.match(/USD.*?([0-9]+\.[0-9]+).*?([0-9]+\.[0-9]+)/s);
          const eurMatch = html.match(/EUR.*?([0-9]+\.[0-9]+).*?([0-9]+\.[0-9]+)/s);
          const rates = [];
          if (usdMatch) rates.push({ cc: "USD", buy: parseFloat(usdMatch[1]), sale: parseFloat(usdMatch[2]) });
          if (eurMatch) rates.push({ cc: "EUR", buy: parseFloat(eurMatch[1]), sale: parseFloat(eurMatch[2]) });
          return rates;
        }
      } catch (e) {
        clearTimeout(timeoutId);
        console.error(`Scraping error for ${bankSlug}:`, e);
      }
      return [];
    };

    const [pumbRates, raifRates, oschadRates] = await Promise.all([
      fetchBankRates("pumb"),
      fetchBankRates("raif"),
      fetchBankRates("oshhadbank")
    ]);

    const getWithFallback = (rates: any[]) => {
      if (rates.length > 0) return rates;
      return [];
    };

    res.setHeader("Cache-Control", forceFresh ? "no-store" : "s-maxage=900, stale-while-revalidate=1800");
    const updatedAt = new Date().toISOString();
    const sources = {
      nbu: { ok: Array.isArray(nbu) && nbu.length > 0, source: "NBU official API", count: Array.isArray(nbu) ? nbu.length : 0, updatedAt },
      privat: { ok: Array.isArray(privat) && privat.length > 0, source: "PrivatBank public API", count: Array.isArray(privat) ? privat.length : 0, updatedAt },
      mono: { ok: Array.isArray(mono) && mono.length > 0, source: "monobank public API", count: Array.isArray(mono) ? mono.length : 0, updatedAt },
      raif: { ok: raifRates.length > 0, source: "finance.ua bank page", count: raifRates.length, updatedAt },
      pumb: { ok: pumbRates.length > 0, source: "finance.ua bank page", count: pumbRates.length, updatedAt },
      oschad: { ok: oschadRates.length > 0, source: "finance.ua bank page", count: oschadRates.length, updatedAt },
    };

    res.json({
      base: "UAH",
      nbu,
      privat,
      mono,
      raif: getWithFallback(raifRates),
      pumb: getWithFallback(pumbRates),
      oschad: getWithFallback(oschadRates),
      sources,
      updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});

// Robots
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: ${process.env.NEXT_PUBLIC_SITE_URL || "https://exchange-rates-ukraine.vercel.app"}/sitemap.xml\n`);
});

app.get("/rates.json", async (_req, res) => {
  res.redirect(307, "/api/rates");
});

app.get("/llms.txt", (_req, res) => {
  res.type("text/plain");
  res.send(`# UAH.today

Live exchange rates in Ukraine for USD, EUR, PLN and GBP.

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
    // In production mode, explicitly serve static files from dist
    app.use(express.static(distPath));
    
    // SPA Fallback for routes not handled by static or API
    app.get("*", (req, res) => {
      // Avoid infinite loops if assets are missing
      if (req.url.startsWith('/api') || req.url.includes('.')) {
        return res.status(404).send('Not found');
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// Start the server (Cloud Run/Local)
if (!process.env.VERCEL) {
  setupVite().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
} else {
  // On Vercel, setupVite logic (SPA fallback) still needs to run
  // but we can't await it top-level if we want synchronous export
  // However, Express handles routes in order. The API and Static are already registered.
  // We just need the wildcard.
  app.get("*", (req, res) => {
    if (req.url.startsWith('/api') || req.url.includes('.')) {
      return res.status(404).send('Not found');
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}

export default app;

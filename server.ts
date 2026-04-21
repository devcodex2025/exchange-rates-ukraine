import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Cache for currency data
  let cache: { [key: string]: { data: any; timestamp: number } } = {};
  const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes overall
  const MONO_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for monobank (strict limits)

  async function fetchWithCache(key: string, url: string) {
    const now = Date.now();
    const duration = key === "mono" ? MONO_CACHE_DURATION : CACHE_DURATION;
    
    if (cache[key] && now - cache[key].timestamp < duration) {
      return cache[key].data;
    }

    try {
      const response = await fetch(url);
      if (response.status === 429) {
        console.warn(`Rate limit hit for ${key}, using cache if available`);
        return cache[key] ? cache[key].data : null;
      }
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      cache[key] = { data, timestamp: now };
      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      return cache[key] ? cache[key].data : null; // Return stale data if available
    }
  }

  // SEO Routes
  app.get("/robots.txt", (req, res) => {
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\nSitemap: ${appUrl}/sitemap.xml`);
  });

  app.get("/sitemap.xml", (req, res) => {
    const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
    res.type("application/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${appUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
  });

  // API Routes
  app.get("/api/rates", async (req, res) => {
    try {
      const [nbu, privat, mono] = await Promise.all([
        fetchWithCache("nbu", "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"),
        fetchWithCache("privat", "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=5"),
        fetchWithCache("mono", "https://api.monobank.ua/bank/currency")
      ]);

      // Simulate Raiffeisen and Oschad by NBU rate + spread as their APIs are restricted
      const raif = nbu ? nbu.filter((r: any) => ["USD", "EUR"].includes(r.cc)).map((r: any) => ({
        cc: r.cc,
        buy: r.rate * 0.985,
        sale: r.rate * 1.015
      })) : [];

      const oschad = nbu ? nbu.filter((r: any) => ["USD", "EUR"].includes(r.cc)).map((r: any) => ({
        cc: r.cc,
        buy: r.rate * 0.98,
        sale: r.rate * 1.02
      })) : [];

      const pumb = nbu ? nbu.filter((r: any) => ["USD", "EUR"].includes(r.cc)).map((r: any) => ({
        cc: r.cc,
        buy: r.rate * 0.982,
        sale: r.rate * 1.018
      })) : [];

      res.json({
        nbu,
        privat,
        mono,
        raif,
        oschad,
        pumb,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rates" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

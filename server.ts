import express from "express";
import { createServer as createViteServer } from "vite";
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

  async function fetchWithCache(key: string, url: string) {
    const now = Date.now();
    const duration = key === "mono" ? MONO_CACHE_DURATION : CACHE_DURATION;
    
    if (cache[key] && now - cache[key].timestamp < duration) {
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
    const [nbu, privat, mono] = await Promise.all([
      fetchWithCache("nbu", "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"),
      fetchWithCache("privat", "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=5"),
      fetchWithCache("mono", "https://api.monobank.ua/bank/currency")
    ]);

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

// Robots
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *\nAllow: /`);
});

// Vite integration / Static files
async function setupVite() {
  const distPath = path.resolve(__dirname, "dist");
  
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the dist directory
    app.use(express.static(distPath));
    
    // Fallback to index.html for SPA routing
    app.get("*", (req, res) => {
      // Avoid infinite loops if assets are missing
      if (req.url.startsWith('/api') || req.url.includes('.')) {
        return res.status(404).send('Not found');
      }
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// Start the server
setupVite().then(() => {
  // On Vercel, the app is exported and Vercel handles the gateway
  // On Cloud Run/Local, we need to listen on a port
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
});

export default app;

interface VercelRequest {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
  url?: string;
}

interface VercelResponse {
  setHeader(name: string, value: string): void;
  status(code: number): {
    json(body: unknown): void;
  };
}

// Cache for currency data
let cache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes overall
const MONO_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for monobank

async function fetchWithCache(key: string, url: string, forceFresh = false) {
  const now = Date.now();
  const duration = key === "mono" ? MONO_CACHE_DURATION : CACHE_DURATION;
  
  if (!forceFresh && cache[key] && now - cache[key].timestamp < duration) {
    return cache[key].data;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.status === 429) return cache[key] ? cache[key].data : null;
    if (!response.ok) return cache[key] ? cache[key].data : null;
    
    const data = await response.json();
    cache[key] = { data, timestamp: now };
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    return cache[key] ? cache[key].data : null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const freshParam = Array.isArray(req.query?.fresh) ? req.query?.fresh[0] : req.query?.fresh;
    const forceFresh = freshParam === "1" || freshParam === "true";
    const [nbu, privat, mono] = await Promise.all([
      fetchWithCache("nbu", "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json", forceFresh),
      fetchWithCache("privat", "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=5", forceFresh),
      fetchWithCache("mono", "https://api.monobank.ua/bank/currency", forceFresh)
    ]);

    const fetchBankRates = async (bankSlug: string) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // reduced timeout for serverless stability

      try {
        const fetchRes = await fetch(`https://finance.ua/ua/currency/banks/${bankSlug}`, { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        }).catch(() => null);
        
        clearTimeout(timeoutId);

        if (fetchRes && fetchRes.ok) {
          const html = await fetchRes.text();
          const usdMatch = html.match(/USD.*?([0-9]+\.[0-9]+).*?([0-9]+\.[0-9]+)/s);
          const eurMatch = html.match(/EUR.*?([0-9]+\.[0-9]+).*?([0-9]+\.[0-9]+)/s);
          const rates = [];
          if (usdMatch) rates.push({ cc: "USD", buy: parseFloat(usdMatch[1]), sale: parseFloat(usdMatch[2]) });
          if (eurMatch) rates.push({ cc: "EUR", buy: parseFloat(eurMatch[1]), sale: parseFloat(eurMatch[2]) });
          return rates;
        }
      } catch (e) {
        clearTimeout(timeoutId);
      }
      return [];
    };

    const [pumbRates, raifRates, oschadRates] = await Promise.all([
      fetchBankRates("pumb"),
      fetchBankRates("raif"),
      fetchBankRates("oshhadbank")
    ]);

    const getWithFallback = (rates: any[]) => {
      if (rates && rates.length > 0) return rates;
      return [];
    };

    const updatedAt = new Date().toISOString();
    const sources = {
      nbu: { ok: Array.isArray(nbu) && nbu.length > 0, source: "NBU official API", count: Array.isArray(nbu) ? nbu.length : 0, updatedAt },
      privat: { ok: Array.isArray(privat) && privat.length > 0, source: "PrivatBank public API", count: Array.isArray(privat) ? privat.length : 0, updatedAt },
      mono: { ok: Array.isArray(mono) && mono.length > 0, source: "monobank public API", count: Array.isArray(mono) ? mono.length : 0, updatedAt },
      raif: { ok: raifRates.length > 0, source: "finance.ua bank page", count: raifRates.length, updatedAt },
      pumb: { ok: pumbRates.length > 0, source: "finance.ua bank page", count: pumbRates.length, updatedAt },
      oschad: { ok: oschadRates.length > 0, source: "finance.ua bank page", count: oschadRates.length, updatedAt },
    };

    res.setHeader('Cache-Control', forceFresh ? 'no-store' : 's-maxage=900, stale-while-revalidate=1800');
    return res.status(200).json({
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
    return res.status(500).json({ error: "Failed to fetch rates" });
  }
}

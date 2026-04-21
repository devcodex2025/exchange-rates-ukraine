import { VercelRequest, VercelResponse } from '@vercel/node';

// Cache for currency data
let cache: { [key: string]: { data: any; timestamp: number } } = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes overall
const MONO_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes for monobank

async function fetchWithCache(key: string, url: string) {
  const now = Date.now();
  const duration = key === "mono" ? MONO_CACHE_DURATION : CACHE_DURATION;
  
  if (cache[key] && now - cache[key].timestamp < duration) {
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
    const [nbu, privat, mono] = await Promise.all([
      fetchWithCache("nbu", "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"),
      fetchWithCache("privat", "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=5"),
      fetchWithCache("mono", "https://api.monobank.ua/bank/currency")
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

    const getWithFallback = (rates: any[], margin: number) => {
      if (rates && rates.length > 0) return rates;
      if (!nbu) return [];
      return nbu.filter((r: any) => ["USD", "EUR"].includes(r.cc)).map((r: any) => ({
        cc: r.cc,
        buy: Math.floor(r.rate * (1 - margin) * 100) / 100,
        sale: Math.ceil(r.rate * (1 + margin) * 100) / 100
      }));
    };

    return res.status(200).json({
      nbu,
      privat,
      mono,
      raif: getWithFallback(raifRates, 0.015),
      pumb: getWithFallback(pumbRates, 0.018),
      oschad: getWithFallback(oschadRates, 0.012), 
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch rates" });
  }
}

interface VercelRequest {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  setHeader(name: string, value: string): void;
  status(code: number): {
    json(body: unknown): void;
  };
}

let cache: { [key: string]: { data: unknown; timestamp: number } } = {};
const CACHE_DURATION = 6 * 60 * 60 * 1000;

const formatNbuDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

async function fetchNbuHistory(currency: string, date: Date) {
  const nbuDate = formatNbuDate(date);
  const response = await fetch(
    `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currency}&date=${nbuDate}&json`,
  );
  if (!response.ok) return null;
  const data = await response.json();
  const first = Array.isArray(data) ? data[0] : null;
  return typeof first?.rate === "number" ? first.rate : null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Open-data endpoint: any web page may call this from browser JS
  // (simple GET, no preflight). Applies to 405/500 responses too.
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const currencyParam = Array.isArray(req.query?.currency) ? req.query.currency[0] : req.query?.currency;
  const daysParam = Array.isArray(req.query?.days) ? req.query.days[0] : req.query?.days;
  const currency = (currencyParam || "USD").toUpperCase();
  const requestedDays = Number.parseInt(daysParam || "7", 10);
  const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 7;
  const cacheKey = `${currency}:${days}`;
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=43200");
    return res.status(200).json(cache[cacheKey].data);
  }

  try {
    const today = new Date();
    const dates = Array.from({ length: days }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - index));
      return date;
    });

    const points = await Promise.all(
      dates.map(async (date) => ({
        date: date.toISOString().slice(0, 10),
        rate: await fetchNbuHistory(currency, date),
      })),
    );

    const payload = { currency, base: "UAH", days, points, updatedAt: new Date().toISOString(), source: "NBU official API" };
    cache[cacheKey] = { data: payload, timestamp: now };
    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=43200");
    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch history", currency, points: [] });
  }
}

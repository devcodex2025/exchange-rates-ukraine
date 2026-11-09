import { RatesAggregatorService } from "../src/services/rates/rates-aggregator.service";

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const freshParam = Array.isArray(req.query?.fresh) ? req.query?.fresh[0] : req.query?.fresh;
    const forceFresh = freshParam === "1" || freshParam === "true";

    const data = await RatesAggregatorService.getAggregatedRates(forceFresh);

    res.setHeader(
      "Cache-Control",
      forceFresh ? "no-store" : "s-maxage=900, stale-while-revalidate=1800",
    );
    return res.status(200).json(data);
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
}

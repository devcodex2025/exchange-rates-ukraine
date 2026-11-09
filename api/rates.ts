import type { AggregatedRatesResponse } from "../src/services/rates/rates-aggregator.service";

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

// The aggregator queries six providers; keep enough headroom for a cold start.
export const config = { maxDuration: 60 };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const freshParam = Array.isArray(req.query?.fresh) ? req.query?.fresh[0] : req.query?.fresh;
  const forceFresh = freshParam === "1" || freshParam === "true";

  try {
    // Loaded lazily so an import level failure returns a readable error instead
    // of taking the whole serverless invocation down.
    const { RatesAggregatorService } = await import("../src/services/rates/rates-aggregator.service");

    const data: AggregatedRatesResponse = await RatesAggregatorService.getAggregatedRates(forceFresh);

    res.setHeader(
      "Cache-Control",
      forceFresh ? "no-store" : "s-maxage=900, stale-while-revalidate=1800",
    );
    return res.status(200).json(data);
  } catch (error) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error("API error:", detail);

    const wantsDebug = req.query?.debug === "1";
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).json(
      wantsDebug
        ? { error: "Failed to fetch exchange rates", detail }
        : { error: "Failed to fetch exchange rates" },
    );
  }
}

import { submitContactForm } from "../src/services/contact-form.service";

interface VercelRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  setHeader(name: string, value: string): void;
  status(code: number): {
    json(body: unknown): void;
  };
}

function headerValue(headers: VercelRequest["headers"], name: string): string {
  const value = headers?.[name];
  return String(Array.isArray(value) ? value[0] ?? "" : value ?? "");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  const ip = headerValue(req.headers, "x-forwarded-for").split(",")[0].trim() || "unknown";
  const userAgent = headerValue(req.headers, "user-agent") || undefined;

  // Vercel's Node runtime parses application/json POST bodies into req.body.
  const result = await submitContactForm(req.body ?? null, ip, userAgent);
  return res.status(result.status).json(result.body);
}

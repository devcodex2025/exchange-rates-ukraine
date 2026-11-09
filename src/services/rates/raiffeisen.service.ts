import { NormalizedBankRate } from "./privatbank.service.js";
import { MinfinBankService } from "./minfin.service.js";

// Raiffeisen Bank Ukraine is listed on minfin under its legal brand "aval".
export class RaiffeisenService {
  static async fetchRates(signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    try {
      return await MinfinBankService.fetchRates("aval", signal);
    } catch (error) {
      console.warn("Raiffeisen fetch warning:", error instanceof Error ? error.message : error);
      return [];
    }
  }
}

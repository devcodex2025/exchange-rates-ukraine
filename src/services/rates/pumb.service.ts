import { NormalizedBankRate } from "./privatbank.service.js";
import { MinfinBankService } from "./minfin.service.js";

export class PumbService {
  static async fetchRates(signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    try {
      return await MinfinBankService.fetchRates("pumb", signal);
    } catch (error) {
      console.warn("PUMB fetch warning:", error instanceof Error ? error.message : error);
      return [];
    }
  }
}

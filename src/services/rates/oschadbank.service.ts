import { NormalizedBankRate } from "./privatbank.service.js";
import { MinfinBankService } from "./minfin.service.js";

export class OschadbankService {
  static async fetchRates(signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    try {
      return await MinfinBankService.fetchRates("oschadbank", signal);
    } catch (error) {
      console.warn("Oschadbank fetch warning:", error instanceof Error ? error.message : error);
      return [];
    }
  }
}

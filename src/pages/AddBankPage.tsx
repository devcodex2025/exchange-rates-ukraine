import React from "react";
import { GitFork, GitPullRequest, FileCode2, Boxes, Image, CheckCircle2, Globe } from "lucide-react";
import { Locale } from "../constants";
import { CodeBlock } from "../components/ui/code-block";

interface AddBankPageProps {
  locale?: Locale;
}

const FORK_SNIPPET: Record<Locale, string> = {
  uk: `# 1. Форкніть https://github.com/devcodex2025/exchange-rates-ukraine
#    (кнопка Fork), потім на своєму комп'ютері:
git clone https://github.com/<ваш-нік>/exchange-rates-ukraine
cd exchange-rates-ukraine
git checkout -b add-sense-bank

# 2. Після правок, наприкінці:
npm run lint && npm test && npm run build
git add -A
git commit -m "feat(rates): add Sense Bank source"
git push -u origin add-sense-bank

# 3. Відкрийте Pull Request:
#    https://github.com/devcodex2025/exchange-rates-ukraine/pulls`,
  en: `# 1. Fork https://github.com/devcodex2025/exchange-rates-ukraine
#    (the Fork button), then on your machine:
git clone https://github.com/<your-username>/exchange-rates-ukraine
cd exchange-rates-ukraine
git checkout -b add-sense-bank

# 2. After your edits, finish with:
npm run lint && npm test && npm run build
git add -A
git commit -m "feat(rates): add Sense Bank source"
git push -u origin add-sense-bank

# 3. Open a Pull Request:
#    https://github.com/devcodex2025/exchange-rates-ukraine/pulls`,
};

const SERVICE_API_SNIPPET = `// src/services/rates/sense.service.ts
import { validateBankRatePair } from "../../lib/rates/validation.js";
import { NormalizedBankRate } from "./privatbank.service.js";

export class SenseService {
  static async fetchRates(signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    const res = await fetch("https://<bank-endpoint>", { signal });
    if (!res.ok) throw new Error("API returned status " + res.status);

    const rows = await res.json();
    const supported = new Set(["USD", "EUR", "PLN", "GBP", "CHF"]);
    const results: NormalizedBankRate[] = [];

    for (const item of rows) {
      const code = item.ccy?.toUpperCase();
      if (!supported.has(code)) continue;
      const val = validateBankRatePair(code, item.buy, item.sale);
      if (val.valid) {
        results.push({ currency: code, buy: val.sanitizedBuy, sell: val.sanitizedSell });
      }
    }
    return results;
  }
}`;

const SERVICE_MINFIN_SNIPPET: Record<Locale, string> = {
  uk: `// Стільки коду потрібно, якщо банк має сторінку на minfin.com.ua:
// src/services/rates/sense.service.ts
import { NormalizedBankRate } from "./privatbank.service.js";
import { MinfinBankService } from "./minfin.service.js";

export class SenseService {
  static async fetchRates(signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    try {
      return await MinfinBankService.fetchRates("<minfin-slug>", signal);
    } catch (error) {
      console.warn("Sense fetch warning:", error instanceof Error ? error.message : error);
      return [];
    }
  }
}`,
  en: `// This much code is needed when the bank has a minfin.com.ua page:
// src/services/rates/sense.service.ts
import { NormalizedBankRate } from "./privatbank.service.js";
import { MinfinBankService } from "./minfin.service.js";

export class SenseService {
  static async fetchRates(signal?: AbortSignal): Promise<NormalizedBankRate[]> {
    try {
      return await MinfinBankService.fetchRates("<minfin-slug>", signal);
    } catch (error) {
      console.warn("Sense fetch warning:", error instanceof Error ? error.message : error);
      return [];
    }
  }
}`,
};

const BANKS_SNIPPET = `// src/constants.ts -> BANKS
{ id: "sense", name: "Sense Bank", shortName: "Sense",
  logo: "/logos/sense.svg", source: "Public API" },`;

const NORMALIZE_SNIPPET: Record<Locale, string> = {
  uk: `// src/lib/rates/normalize.ts
// 1) Додайте тип масиву до RawRatesResponse:
sense?: Array<{ cc?: string; buy: number | string | null; sale: number | string | null }>;

// 2) Після pumb.forEach додайте:
data.sense?.forEach((rate) => pushRate("sense", rate.cc, rate.buy, rate.sale));`,
  en: `// src/lib/rates/normalize.ts
// 1) Add the array type to RawRatesResponse:
sense?: Array<{ cc?: string; buy: number | string | null; sale: number | string | null }>;

// 2) After the pumb.forEach loop, add:
data.sense?.forEach((rate) => pushRate("sense", rate.cc, rate.buy, rate.sale));`,
};

const AGGREGATOR_SNIPPET: Record<Locale, string> = {
  uk: `// src/services/rates/rates-aggregator.service.ts - 4 правки:
import { SenseService } from "./sense.service.js";                    // 1 імпорт

const [nbu, privat, /* ... */, senseResult] = await Promise.all([     // 2 запит
  // ...існуючі,
  globalCache.getOrFetch(
    "sense_rates",                                                    // ключ кешу
    () => withTimeout((signal) => SenseService.fetchRates(signal)),
    CACHE_TTL_DEFAULT,
    forceFresh,
  ),
]);

sense: senseData.map((i) => ({ cc: i.currency, buy: i.buy, sale: i.sell })), // 3 видача

source: { /* ...існуючі, */
  sense: makeMeta("Sense Bank Feed", senseResult),                    // 4 статуси
}`,
  en: `// src/services/rates/rates-aggregator.service.ts - 4 edits:
import { SenseService } from "./sense.service.js";                    // 1 import

const [nbu, privat, /* ... */, senseResult] = await Promise.all([     // 2 request
  // ...existing ones,
  globalCache.getOrFetch(
    "sense_rates",                                                    // cache key
    () => withTimeout((signal) => SenseService.fetchRates(signal)),
    CACHE_TTL_DEFAULT,
    forceFresh,
  ),
]);

sense: senseData.map((i) => ({ cc: i.currency, buy: i.buy, sale: i.sell })), // 3 output

source: { /* ...existing ones, */
  sense: makeMeta("Sense Bank Feed", senseResult),                    // 4 statuses
}`,
};

const LOGO_SNIPPET: Record<Locale, string> = {
  uk: `public/logos/sense.svg        # світла тема
public/logos/dark/sense.svg  # темна тема, якщо у лого чорні елементи`,
  en: `public/logos/sense.svg        # light theme
public/logos/dark/sense.svg  # dark theme, if the logo has black elements`,
};

export const AddBankPage: React.FC<AddBankPageProps> = ({ locale = "uk" }) => {
  const isEnglish = locale === "en";
  const title = isEnglish ? "Add a new bank" : "Додати банк";

  return (
    <main className="mx-auto max-w-4xl py-8">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020] md:p-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-[#2E2E2E]">
          <div className="rounded-xl bg-brand-600/10 p-2.5 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
            <GitPullRequest size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">
              {isEnglish ? "Add a new bank to UAH.today" : "Додати банк у UAH.today"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#ADB7BE] sm:text-sm">
              {isEnglish
                ? "Contributor guide: wire a new rate source into the aggregator and open a Pull Request on GitHub."
                : "Гайд для контриб'юторів: підключення нового джерела курсів через Pull Request на GitHub."}
            </p>
          </div>
        </div>

        <div className="prose-sm mt-6 space-y-6 text-sm leading-6 text-slate-600 dark:text-[#ADB7BE]">
          <p>
            {isEnglish
              ? "UAH.today combines six rate sources (NBU, PrivatBank, monobank, Raiffeisen, Oschadbank, PUMB). Adding a bank means: a fetcher service, four registration points in the aggregator, a constants row, a normalize hook and two SVG logos. Everything lands as one Pull Request — the snippets below are the exact shapes reviewers expect."
              : "UAH.today агрегує шість джерел курсів (НБУ, ПриватБанк, monobank, Райффайзен, Ощадбанк, ПУМБ). Додати банк означає: сервіс-фетчер, чотири точки реєстрації в агрегаторі, рядок у константах, хук у normalize і дві SVG-логотипи. Все це — один Pull Request; сніпети нижче — саме ті форми, які очікують рев'ювери."}
          </p>

          <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]">
            <div className="flex items-start gap-2">
              <Globe size={16} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isEnglish ? "What qualifies as a source" : "Що підходить як джерело"}
                </h2>
                <ul className="mt-2 space-y-1.5 text-xs leading-5">
                  <li>
                    {isEnglish
                      ? "Public endpoint without API keys (like PrivatBank's p24api) — implement it like PrivatBankService."
                      : "Публічний ендпоінт без API-ключів (як p24api ПриватБанку) — робіть за зразком PrivatBankService."}
                  </li>
                  <li>
                    {isEnglish
                      ? "The bank's minfin.com.ua page (server-rendered cash table) — a three-line wrapper around MinfinBankService is enough."
                      : "Сторінка банку на minfin.com.ua (серверна таблиця готівки) — достатньо трьохрядкового врапера MinfinBankService."}
                  </li>
                  <li>
                    {isEnglish
                      ? "Currencies: USD, EUR, PLN, GBP, CHF against UAH. The aggregator applies its own 6s timeout and stale/cached bookkeeping."
                      : "Валюти: USD, EUR, PLN, GBP, CHF до гривні. Агрегатор сам застосовує таймаут 6 с і книжкову логіку stale/cached."}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Step 1 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white">
              <GitFork size={18} className="text-brand-600 dark:text-brand-300" />
              {isEnglish ? "1. Fork, branch, then open the PR" : "1. Форк, гілка — і в кінці PR"}
            </h2>
            <div className="mt-3">
              <CodeBlock code={FORK_SNIPPET[locale]} />
            </div>
          </section>

          {/* Step 2 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white">
              <FileCode2 size={18} className="text-brand-600 dark:text-brand-300" />
              {isEnglish ? "2. Create the fetcher service" : "2. Сервіс джерела курсів"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "Returns NormalizedBankRate[] — rows of { currency, buy, sell }. Validate every pair with validateBankRatePair: it filters obvious junk (zero, mirrored, absurd rates) the same way for every bank."
                : "Сервіс повертає NormalizedBankRate[] — рядки виду { currency, buy, sell }. Кожну пару пропускайте через validateBankRatePair: вона відсіє явний сміття (нулі, дзеркальні, абсурдні курси) для всіх банків однаково."}
            </p>
            <div className="mt-3">
              <CodeBlock code={SERVICE_API_SNIPPET} />
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-[#ADB7BE]">
              {isEnglish ? "No API? Reuse the minfin parser:" : "Немає API? Повторно використайте minfin-парсер:"}
            </p>
            <div className="mt-2">
              <CodeBlock code={SERVICE_MINFIN_SNIPPET[locale]} />
            </div>
          </section>

          {/* Step 3 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white">
              <Boxes size={18} className="text-brand-600 dark:text-brand-300" />
              {isEnglish ? "3. Register it in the aggregator" : "3. Реєстрація в агрегаторі"}
            </h2>
            <div className="mt-3">
              <CodeBlock code={AGGREGATOR_SNIPPET[locale]} />
            </div>
          </section>

          {/* Step 4 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {isEnglish ? "4. Add the BANKS entry" : "4. Рядок у BANKS"}
            </h2>
            <div className="mt-3">
              <CodeBlock code={BANKS_SNIPPET} />
            </div>
            <p className="mt-2 text-xs text-slate-500 dark:text-[#ADB7BE]">
              {isEnglish
                ? "id must match the response field name from step 3; shortName is what the narrow cards show; name and logo are picked up automatically by the normalizer."
                : "id має збігатися з іменем поля відповіді з кроку 3; shortName — те, що показують вузькі картки; name та лого нормалізатор підхоплює автоматично."}
            </p>
          </section>

          {/* Step 5 */}
          <section>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {isEnglish ? "5. Hook it into the normalizer" : "5. Хук у нормалізатор"}
            </h2>
            <div className="mt-3">
              <CodeBlock code={NORMALIZE_SNIPPET[locale]} />
            </div>
          </section>

          {/* Step 6 */}
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-950 dark:text-white">
              <Image size={18} className="text-brand-600 dark:text-brand-300" />
              {isEnglish ? "6. Logos, light and dark" : "6. Логотипи: світла та темна теми"}
            </h2>
            <div className="mt-3">
              <CodeBlock code={LOGO_SNIPPET[locale]} />
            </div>
            <ul className="mt-3 space-y-1.5 text-xs leading-5">
              <li>
                {isEnglish
                  ? "If the logo carries near-black glyphs, add its basename to DARK_LOGO_BASENAMES in src/components/ui/bank-logo.tsx — otherwise the dark theme shows the wrong (light) variant."
                  : " Якщо у лого є майже чорні елементи, додайте його basename до DARK_LOGO_BASENAMES у src/components/ui/bank-logo.tsx — інакше темна тема покаже світлу версію."}
              </li>
              <li>
                {isEnglish
                  ? "Keep SVGs small (< ~4 KB). The dark variant must read on #202020; colors of the brand stay."
                  : "Тримайте SVG малими (~4 КБ). Темна версія має читатися на #202020; кольори бренду не змінюються."}
              </li>
            </ul>
          </section>

          {/* PR checklist */}
          <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]">
            <div className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isEnglish ? "PR checklist" : "Чекліст для PR"}
                </h2>
                <ul className="mt-2 space-y-1.5 text-xs leading-5">
                  <li>{isEnglish ? "npm run lint, npm test and npm run build all pass." : "npm run lint, npm test і npm run build проходять."}</li>
                  <li>{isEnglish ? "Service has no API keys, no fixed credentials, respects the AbortSignal." : "У сервісі немає ключів і зашитих креденшелів, AbortSignal поважається."}</li>
                  <li>{isEnglish ? "All five supported currencies are parsed (or the source has only some of them — fine, others just show no data)." : "Всі п'ять підтримуваних валют парсяться (або джерело має лише частину — ок, решта просто без даних)."}</li>
                  <li>{isEnglish ? "Both logo variants look right in the light and dark themes." : "Обидві версії лого виглядають правильно у світлій і темній темах."}</li>
                  <li>{isEnglish ? "After merge, check GET /api/rates - the new key and sources entry must appear." : "Після мерджу перевірте GET /api/rates — нове поле і запис у sources мають з'явитися."}</li>
                </ul>
                <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-[#ADB7BE]">
                  {isEnglish
                    ? "Every PR gets a Vercel preview automatically. Maintainers usually review within a few days; data quality questions are tracked via GitHub issues."
                    : "До кожного PR Vercel автоматично будує прев'ю. Рев'ю зазвичай упродовж кількох днів; питання якості даних — у GitHub issues."}
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
};
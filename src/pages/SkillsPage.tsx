import React from "react";
import { Bot, Terminal, Table2, History, ShieldAlert, Blocks } from "lucide-react";
import { Locale } from "../constants";
import { CodeBlock } from "../components/ui/code-block";

interface SkillsPageProps {
  locale?: Locale;
}

const RAW_BASE =
  "https://raw.githubusercontent.com/devcodex2025/exchange-rates-ukraine/main/.agents/skills/uah-today-api";

const installScript = (dir: string) =>
  `mkdir -p ${dir}/uah-today-api\n` +
  `curl -fsSL ${RAW_BASE}/SKILL.md -o ${dir}/uah-today-api/SKILL.md\n` +
  `curl -fsSL ${RAW_BASE}/playbooks.md -o ${dir}/uah-today-api/playbooks.md`;

const SAMPLE_JSON = `{
  "base": "UAH",
  "updatedAt": "2026-11-09T10:15:00.000Z",
  "nbu":    [{ "cc": "USD", "rate": 41.7278, "exchangedate": "09.11.2026" }],
  "privat": [{ "ccy": "USD", "buy": 41.10, "sale": 41.95 }],
  "raif":   [{ "cc": "USD", "buy": 41.15, "sale": 41.90 }],
  "oschad": [{ "cc": "USD", "buy": 41.00, "sale": 41.90 }],
  "pumb":   [{ "cc": "USD", "buy": 41.05, "sale": 41.90 }],
  "mono":   [{ "currencyCodeA": 840, "currencyCodeB": 980, "rateBuy": 41.30, "rateSell": 41.65 }],
  "sources": {
    "privat": { "status": "cached", "isStale": false, "errorMessage": null, "count": 5 }
  }
}`;

const Capability: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]">
    <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
      {icon}
      <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
    </div>
    <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-[#ADB7BE]">{text}</p>
  </div>
);

export const SkillsPage: React.FC<SkillsPageProps> = ({ locale = "uk" }) => {
  const isEnglish = locale === "en";
  const title = isEnglish ? "UAH.today skills for AI agents" : "Скіли UAH.today для AI-агентів";

  const capabilities = [
    {
      icon: <Table2 size={16} />,
      title: isEnglish ? "Bank comparison" : "Порівняння банків",
      text: isEnglish
        ? "Best buy and sell rates across PrivatBank, Raiffeisen, Oschadbank, PUMB plus the monobank card rate — with correct null handling."
        : "Найкращі курси купівлі та продажу ПриватБанку, Райффайзену, Ощадбанку, ПУМБ + картковий курс monobank — з коректною обробкою null.",
    },
    {
      icon: <Blocks size={16} />,
      title: isEnglish ? "Conversion math" : "Конвертація",
      text: isEnglish
        ? "Direction-correct formulas: sell FX at the bank's buy rate, buy FX at the sell rate. monobank rateCross fallback built in."
        : "Формули за напрямком: продати валюту за курсом buy, купити за курсом sell. Вбудований fallback на rateCross для monobank.",
    },
    {
      icon: <ShieldAlert size={16} />,
      title: isEnglish ? "NBU reference & spread" : "Офіційний курс НБУ",
      text: isEnglish
        ? "Official NBU rate as the baseline, plus how far each bank's cash quotes deviate from it."
        : "Офіційний курс НБУ як база порівняння + наскільки курси кожного банку відхиляються від нього.",
    },
    {
      icon: <History size={16} />,
      title: isEnglish ? "7/30/90-day history" : "Історія 7/30/90 днів",
      text: isEnglish
        ? "NBU daily rates with weekend nulls preserved — trend stats, min/max, CSV export out of the box."
        : "Офіційні денні курси НБУ з null у вихідні — тренд, min/max, експорт у CSV з коробки.",
    },
  ];

  const installs = [
    {
      label: isEnglish ? "OpenCode — project skill" : "OpenCode — проєктний скіл",
      hint: isEnglish
        ? "Lands in the project's .agents/skills/ — the agent picks it up for this repository."
        : "Файли опиняться в .agents/skills/ проєкту — агент підхопить їх для цього репозиторію.",
      dir: ".agents/skills",
    },
    {
      label: isEnglish ? "Claude Code" : "Claude Code",
      hint: isEnglish
        ? "Same two files, Claude Code's project skills directory."
        : "Ті самі два файли у каталозі скілів проєкту Claude Code.",
      dir: ".claude/skills",
    },
  ];

  const prompts = isEnglish
    ? [
        "\"Where is it best to sell 1000 USD for hryvnia today? Show every bank's quote and the timestamp.\"",
        "\"Bank cards vs cash: what is the cheapest way to buy 500 EUR, cash desks included.\"",
        "\"Build a CSV of NBU USD rate for the last 30 days and summarize the trend.\"",
        "\"How far is the average bank EUR price from the official NBU rate right now?\"",
      ]
    : [
        "«Де найвигідніше продати 1000 доларів за гривню сьогодні? Покажи курси всіх банків і час оновлення.»",
        "«Картковий чи готівковий курс: як найдешевше купити 500 євро, враховуючи відділення.»",
        "«Збери CSV офіційного курсу долара НБУ за останні 30 днів і підсумуй тренд.»",
        "«Наскільки середній банківський курс євро відрізняється від офіційного курсу НБУ зараз?»",
      ];

  return (
    <main className="mx-auto max-w-4xl py-8">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020] md:p-10">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5 dark:border-[#2E2E2E]">
          <div className="rounded-xl bg-brand-600/10 p-2.5 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-950 dark:text-white sm:text-3xl">{title}</h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#ADB7BE] sm:text-sm">
              {isEnglish
                ? "Teach your AI agent to use the UAH.today rates API — one markdown file, no keys."
                : "Навчіть свого AI-агента користуватись API курсів UAH.today — один markdown-файл, без ключів."}
            </p>
          </div>
        </div>

        <div className="prose-sm mt-6 space-y-6 text-sm leading-6 text-slate-600 dark:text-[#ADB7BE]">
          <p>
            {isEnglish
              ? "UAH.today ships an installable agent skill: plain markdown that documents both API endpoints, response schemas, caching behavior and the gotchas (buy vs sell, monobank numeric codes, weekend nulls). Drop the two files into your agent's skills directory — or paste them into the system prompt — and the agent can answer currency questions with live, properly sourced data."
              : "UAH.today постачає вбудований скіл для агентів: звичайний markdown, що описує обидва ендпоінти API, схеми відповідей, кешування і підводні камені (buy vs sell, числові коди monobank, null у вихідні). Покладіть два файли в каталог скілів свого агента — або вставте в системний промпт — і агент зможе відповідати на валютні запити, спираючись на живі дані з коректно зазначеним джерелом."}
          </p>

          {/* Capabilities */}
          <section>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {isEnglish ? "What the skill unlocks" : "Що вміє агент зі скілом"}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {capabilities.map((c) => (
                <Capability key={c.title} icon={c.icon} title={c.title} text={c.text} />
              ))}
            </div>
          </section>

          {/* Install */}
          <section>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {isEnglish ? "Installation" : "Встановлення"}
            </h2>
            <p className="mt-2">
              {isEnglish
                ? "The skill lives in this repository at .agents/skills/uah-today-api/ (SKILL.md + playbooks.md). Fetch both files with curl:"
                : "Скіл живе в цьому репозиторії за шляхом .agents/skills/uah-today-api/ (SKILL.md + playbooks.md). Завантажте обидва файли через curl:"}
            </p>
            <div className="mt-3 space-y-4">
              {installs.map((inst) => (
                <div key={inst.dir} className="rounded-xl border border-slate-200 p-4 dark:border-[#2E2E2E]">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{inst.label}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-[#ADB7BE]">{inst.hint}</p>
                  <div className="mt-3">
                    <CodeBlock code={installScript(inst.dir)} />
                  </div>
                </div>
              ))}
              <div className="rounded-xl border border-slate-200 p-4 dark:border-[#2E2E2E]">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isEnglish ? "Any other agent" : "Будь-який інший агент"}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#ADB7BE]">
                  {isEnglish
                    ? "Paste the raw SKILL.md into the agent's instructions, or let it fetch:"
                    : "Вставте вміст SKILL.md в інструкції агента або дозвольте йому прочитати:"}
                </p>
                <div className="mt-3">
                  <CodeBlock code={`${RAW_BASE}/SKILL.md`} />
                </div>
              </div>
            </div>
          </section>

          {/* API overview */}
          <section>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {isEnglish ? "API at a glance" : "API у двох словах"}
            </h2>
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-[#2E2E2E]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 dark:bg-[#2A2A2A] dark:text-[#ADB7BE]">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">{isEnglish ? "Endpoint" : "Ендпоінт"}</th>
                    <th className="px-4 py-2.5 font-semibold">{isEnglish ? "Returns" : "Повертає"}</th>
                    <th className="px-4 py-2.5 font-semibold">{isEnglish ? "Cache" : "Кеш"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#2E2E2E]">
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-900 dark:text-white">GET /api/rates[?fresh=1]</td>
                    <td className="px-4 py-2.5">
                      {isEnglish ? "NBU + 4 banks + monobank card + per-source status" : "НБУ + 4 банки + картковий курс monobank + статус джерел"}
                    </td>
                    <td className="px-4 py-2.5">
                      {isEnglish ? "15 min server (30 min mono); fresh=1 bypasses" : "15 хв сервер (30 хв mono); fresh=1 обходить"}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-mono text-[11px] text-slate-900 dark:text-white">
                      {"GET /api/history?currency=USD&days=30"}
                    </td>
                    <td className="px-4 py-2.5">{isEnglish ? "NBU daily rates, 7/30/90 days" : "Офіційні курси НБУ, 7/30/90 днів"}</td>
                    <td className="px-4 py-2.5">{isEnglish ? "6 hours" : "6 годин"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4">
              {isEnglish ? "Sample response (trimmed):" : "Приклад відповіді (скорочено):"}
            </p>
            <div className="mt-2">
              <CodeBlock code={`curl -fsSL https://exchange-rates-ukraine.vercel.app/api/rates`} />
            </div>
            <div className="mt-2">
              <CodeBlock code={SAMPLE_JSON} />
            </div>
            <p className="mt-3 text-xs text-slate-500 dark:text-[#ADB7BE]">
              {isEnglish
                ? "monobank codes are numeric ISO: 840 USD · 978 EUR · 826 GBP · 756 CHF · 985 PLN · base currencyCodeB 980 (UAH). Full field rules live in the SKILL.md."
                : "Коди monobank — числові ISO: 840 USD · 978 EUR · 826 GBP · 756 CHF · 985 PLN · база currencyCodeB 980 (UAH). Повні правила полів — у SKILL.md."}
            </p>
          </section>

          {/* Example prompts */}
          <section>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
              {isEnglish ? "Try it" : "Спробуйте"}
            </h2>
            <ul className="mt-3 space-y-2">
              {prompts.map((p) => (
                <li key={p} className="rounded-lg bg-slate-50 px-4 py-2.5 text-xs text-slate-700 dark:bg-[#2A2A2A] dark:text-[#ADB7BE]">
                  {p}
                </li>
              ))}
            </ul>
          </section>

          {/* Limitations */}
          <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-[#2E2E2E] dark:bg-[#2A2A2A]">
            <div className="flex items-start gap-2">
              <Terminal size={16} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {isEnglish ? "Rules & attribution" : "Правила та атрибуція"}
                </h2>
                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-600 dark:text-[#ADB7BE]">
                  <li>
                    {isEnglish
                      ? "buy = the bank buys FX from you (FX → UAH); sell = the bank sells FX to you (UAH → FX)."
                      : "buy = банк купує валюту у вас (валюта → грн); sell = банк продає валюту вам (грн → валюта)."}
                  </li>
                  <li>
                    {isEnglish
                      ? "Missing values are null — the agent must never fill bank gaps with NBU data."
                      : "Відсутні значення — null; агент не має заповнювати пробіли банків даними НБУ."}
                  </li>
                  <li>
                    {isEnglish
                      ? "history returns rate: null on weekends and holidays — keep it null unless you say you forward-filled."
                      : "history повертає rate: null у вихідні та свята — тримайте null, якщо явно не вказали інтерполяцію."}
                  </li>
                  <li>
                    {isEnglish
                      ? "Rates are informational; credit \"UAH.today\" and the updatedAt timestamp when publishing."
                      : "Курси — інформаційні; при публікації указуйте «UAH.today» і час updatedAt."}
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
};

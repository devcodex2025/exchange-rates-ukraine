export const SITE_URL =
  import.meta.env.VITE_SITE_URL ||
  import.meta.env.NEXT_PUBLIC_SITE_URL ||
  "https://exchange-rates-ukraine.vercel.app";

export const CURRENCY_MAP: Record<number, string> = {
  980: "UAH",
  840: "USD",
  978: "EUR",
  826: "GBP",
  756: "CHF",
  985: "PLN",
};

export const CURRENCY_CODES = ["USD", "EUR", "PLN", "GBP"] as const;

export const CURRENCY_NAMES: Record<string, { uk: string; en: string; symbol: string }> = {
  USD: { uk: "Долар США", en: "US dollar", symbol: "$" },
  EUR: { uk: "Євро", en: "Euro", symbol: "€" },
  UAH: { uk: "Гривня", en: "Ukrainian hryvnia", symbol: "₴" },
  PLN: { uk: "Польський злотий", en: "Polish zloty", symbol: "zł" },
  GBP: { uk: "Фунт стерлінгів", en: "British pound", symbol: "£" },
  CHF: { uk: "Швейцарський франк", en: "Swiss franc", symbol: "Fr" },
};

export const BANKS = [
  { id: "privat", name: "PrivatBank", shortName: "Privat", logo: "/logos/privat.svg", source: "Public API" },
  { id: "mono", name: "monobank", shortName: "mono", logo: "/logos/mono.svg", source: "Public API" },
  { id: "raif", name: "Raiffeisen Bank", shortName: "Raif", logo: "/logos/raiffeisen.svg", source: "Finance.ua page" },
  { id: "oschad", name: "Oschadbank", shortName: "Oschad", logo: "/logos/oschad.svg", source: "Finance.ua page" },
  { id: "pumb", name: "PUMB", shortName: "PUMB", logo: "/logos/pumb.svg", source: "Finance.ua page" },
  { id: "nbu", name: "National Bank of Ukraine", shortName: "NBU", logo: "/logos/nbu.svg", source: "Official API" },
] as const;

export type Locale = "uk" | "en";

export const UI_COPY = {
  uk: {
    navRates: "Курси",
    navConverter: "Конвертер",
    eyebrow: "Живий валютний ринок України",
    heroTitle: "Курс валют в Україні сьогодні",
    heroSubtitle:
      "Порівнюйте USD, EUR, PLN і GBP у банках та за офіційним курсом НБУ. Бачите тільки ті значення, які реально прийшли з джерел.",
    viewRates: "Дивитись курси",
    converter: "Конвертер валют",
    faq: "Питання",
    lastUpdate: "Оновлено",
    definitions:
      "Купівля - банк купує валюту у клієнта. Продаж - банк продає валюту клієнту. НБУ - офіційний довідковий курс.",
    refresh: "Оновити",
    liveSources: "Джерела даних",
    available: "доступно",
    unavailable: "немає даних",
    trustTitle: "Прозорість джерел",
    trustBody:
      "НБУ, PrivatBank і monobank отримуються через публічні API. Raiffeisen, Oschadbank і PUMB показуються лише якщо сторінки finance.ua повернули розпізнані значення.",
    aiBody: "/api/rates, /rates.json і /llms.txt відкривають структуровані дані для пошуку та AI-асистентів.",
    footerNote: "Курси мають інформаційний характер і можуть відрізнятися у відділенні або застосунку банку.",
    buy: "Купівля",
    sell: "Продаж",
    bestBuy: "Краща купівля",
    bestSell: "Кращий продаж",
    noData: "Немає даних",
    spread: "Спред",
    nbu: "НБУ",
    updated: "Оновлено",
    tableBank: "Банк",
    tableCurrency: "Валюта",
    tableStatus: "Статус",
    ratesTableTitle: "Таблиця курсів банків",
    ratesTableSubtitle: "HTML-таблиця для SEO, машинного пошуку та швидкого порівняння.",
    searchBank: "Пошук банку",
    faqTitle: "Питання про курс валют",
    faqSubtitle: "Короткі визначення для людей і машинного пошуку.",
    chartUnavailable:
      "Історичні графіки тимчасово приховані, доки немає надійного історичного API. Поточні курси доступні в таблиці.",
    aiTitle: "Дані для AI",
  },
  en: {
    navRates: "Rates",
    navConverter: "Converter",
    eyebrow: "Live Ukrainian FX market",
    heroTitle: "Live exchange rates in Ukraine",
    heroSubtitle:
      "Compare USD, EUR, PLN and GBP across banks and the official NBU rate. The page shows only values returned by real sources.",
    viewRates: "View rates",
    converter: "Currency converter",
    faq: "FAQ",
    lastUpdate: "Last update",
    definitions:
      "Buy is what a bank pays for currency. Sell is what a bank charges customers. NBU is the official reference rate.",
    refresh: "Refresh",
    liveSources: "Data sources",
    available: "available",
    unavailable: "no data",
    trustTitle: "Source transparency",
    trustBody:
      "NBU, PrivatBank and monobank are fetched through public APIs. Raiffeisen, Oschadbank and PUMB are shown only when finance.ua pages return parseable values.",
    aiBody: "/api/rates, /rates.json and /llms.txt expose structured data for search engines and AI assistants.",
    footerNote: "Rates are informational and may differ at a bank branch or in a banking app.",
    buy: "Buy",
    sell: "Sell",
    bestBuy: "Best buy",
    bestSell: "Best sell",
    noData: "No data",
    spread: "Spread",
    nbu: "NBU",
    updated: "Updated",
    tableBank: "Bank",
    tableCurrency: "Currency",
    tableStatus: "Status",
    ratesTableTitle: "Bank exchange rates table",
    ratesTableSubtitle: "Server-readable values with null-safe source handling.",
    searchBank: "Search bank",
    faqTitle: "Exchange rate FAQ",
    faqSubtitle: "Short definitions for users and AI crawlers.",
    chartUnavailable:
      "Historical charts are hidden until a reliable historical API is available. Current rates are available in the table.",
    aiTitle: "AI data",
  },
} as const;

export const FAQ_UK = [
  {
    question: "Що означає курс купівлі та продажу?",
    answer:
      "Курс купівлі показує, за скільки банк купує валюту у клієнта. Курс продажу показує, за скільки банк продає валюту клієнту.",
  },
  {
    question: "Чим курс НБУ відрізняється від банківського?",
    answer:
      "Курс НБУ є офіційним довідковим курсом для обліку та розрахунків. Банківський курс використовується для реальної купівлі або продажу валюти і може відрізнятися через спред.",
  },
  {
    question: "Як знайти найкращий курс долара сьогодні?",
    answer:
      "Порівняйте курс продажу, якщо купуєте долар, або курс купівлі, якщо продаєте. Таблиця виділяє найвигідніші доступні пропозиції для вибраної валюти.",
  },
  {
    question: "Як часто оновлюються дані?",
    answer:
      "Сервер кешує більшість джерел приблизно на 15 хвилин, а monobank - до 30 хвилин через обмеження API. Час останнього оновлення показаний на сторінці.",
  },
  {
    question: "Чи можна використовувати дані в AI або власному застосунку?",
    answer:
      "Так. Для машинного читання доступні /api/rates, /rates.json і /llms.txt. Якщо значення відсутнє у джерелі, воно повертається як null або порожній список, без вигаданих даних.",
  },
];

export const FAQ_EN = [
  {
    question: "What do buy and sell rates mean?",
    answer:
      "The buy rate is the price a bank pays when buying foreign currency from a customer. The sell rate is the price a customer pays when buying currency from a bank.",
  },
  {
    question: "How is the NBU rate different from bank rates?",
    answer:
      "The NBU rate is the official reference rate used for accounting and settlements. Bank rates are commercial exchange rates used for real transactions.",
  },
  {
    question: "How do I find the best USD to UAH rate today?",
    answer:
      "Compare the sell rate when buying USD or the buy rate when selling USD. The table highlights the strongest available offer for the selected currency.",
  },
];

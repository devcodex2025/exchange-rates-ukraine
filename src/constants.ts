export const SITE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SITE_URL) ||
  (typeof process !== "undefined" && process.env && (process.env.VITE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL)) ||
  "https://exchange-rates-ukraine.vercel.app";

// Google AdSense units. Leave an entry empty to keep the reserved placeholder;
// paste the numeric data-ad-slot from the cabinet (Ads → By ad unit) to go live.
export const ADSENSE = {
  client: "ca-pub-5995594246081561",
  slots: {
    "ad-top-banner": "",
    "ad-sidebar": "",
  } as Record<string, string>,
};

export const CURRENCY_MAP: Record<number, string> = {
  980: "UAH",
  840: "USD",
  978: "EUR",
  826: "GBP",
  756: "CHF",
  985: "PLN",
};

export const CURRENCY_CODES = ["USD", "EUR", "PLN", "GBP", "CHF"] as const;

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
  { id: "raif", name: "Raiffeisen Bank", shortName: "Raif", logo: "/logos/raiffeisen.svg", source: "Minfin page" },
  { id: "oschad", name: "Oschadbank", shortName: "Oschad", logo: "/logos/oschad.svg", source: "Minfin page" },
  { id: "pumb", name: "PUMB", shortName: "PUMB", logo: "/logos/pumb.svg", source: "Minfin page" },
  { id: "nbu", name: "National Bank of Ukraine", shortName: "NBU", logo: "/logos/nbu.svg", source: "Official API" },
] as const;

export type Locale = "uk" | "en";

export const UI_COPY = {
  uk: {
    navRates: "Курси",
    navConverter: "Конвертер",
    navBest: "Кращий курс",
    navInsights: "Аналітика",
    eyebrow: "UAH.today — Порівняння курсів валют в Україні",
    heroTitle: "Знайдіть найкращий курс валют в Україні",
    heroSubtitle:
      "Незалежний моніторинг курсів готівкової валюти в банках України та офіційного курсу НБУ. Розраховуйте вигідний обмін за лічені секунди.",
    viewRates: "Дивитись курси",
    converter: "Конвертер валют",
    faq: "Питання",
    lastUpdate: "Оновлено",
    definitions:
      "Купівля — банк купує валюту у вас. Продаж — банк продає валюту вам. НБУ — офіційний довідковий курс.",
    refresh: "Оновити",
    liveSources: "Джерела даних",
    available: "доступно",
    unavailable: "немає даних",
    trustTitle: "Прозорість джерел",
    trustBody:
      "НБУ, PrivatBank і monobank отримуються через офіційні відкриті API. Raiffeisen, Oschadbank і PUMB перевіряються та валідуються на відповідність ринковим межам.",
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
    ratesTableTitle: "Порівняльна таблиця курсів у банках",
    ratesTableSubtitle: "Офіційні дані банків без штучних округлень чи синтетичних підмін.",
    searchBank: "Пошук банку...",
    faqTitle: "Часті запитання про курс валют",
    faqSubtitle: "Зрозумілі відповіді про купівлю, продаж та різницю курсів.",
    chartUnavailable:
      "Історичні графіки базуються на офіційному архіві НБУ. Поточні курси банків дивіться у таблиці.",
    aiTitle: "Дані для AI",
    bestRateFinderTitle: "Кращий курс валют прямо зараз",
    bestRateFinderSubtitle: "Де вигідніше купити чи продати іноземну валюту сьогодні",
    bestToBuyTitle: "Вигідніше купити",
    bestToSellTitle: "Вигідніше продати",
    whereToBuy: "Де купити за мінімальною ціною",
    whereToSell: "Де здати за максимальною ціною",
    insightsTitle: "Аналітика валютного ринку",
    insightsSubtitle: "Спреди, різниця між банками та відхилення від курсу регулятора",
    nbuDiff: "Різниця з НБУ",
    bankSpread: "Середній спред",
    marketRange: "Діапазон ринку",
    adLabel: "Реклама",
    cookieConsentTitle: "Використання файлів cookie",
    cookieConsentText:
      "Ми використовуємо файли cookie для збереження ваших налаштувань, забезпечення стабільної роботи сайту та показу релевантних оголошень через Google AdSense.",
    cookieAccept: "Прийняти всі",
    cookieDecline: "Лише необхідні",
    privacyLink: "Політика конфіденційності",
    termsLink: "Умови використання",
    aboutLink: "Про платформу",
    contactLink: "Контакти",
  },
  en: {
    navRates: "Rates",
    navConverter: "Converter",
    navBest: "Best Rates",
    navInsights: "Insights",
    eyebrow: "UAH.today — Ukrainian Currency Comparison Platform",
    heroTitle: "Find the best exchange rate in Ukraine",
    heroSubtitle:
      "Compare real-time bank exchange rates for USD, EUR, PLN, GBP, and CHF with the official NBU rate. Convert instantly with the strongest market rates.",
    viewRates: "View rates",
    converter: "Currency converter",
    faq: "FAQ",
    lastUpdate: "Last update",
    definitions:
      "Buy: the bank buys currency from you. Sell: the bank sells currency to you. NBU: official reference benchmark.",
    refresh: "Refresh",
    liveSources: "Data sources",
    available: "available",
    unavailable: "no data",
    trustTitle: "Source transparency",
    trustBody:
      "NBU, PrivatBank and monobank are fetched via verified official APIs. Raiffeisen, Oschadbank and PUMB values are validated against plausible market spreads.",
    aiBody: "/api/rates, /rates.json and /llms.txt provide structured data feeds for search engines and AI assistants.",
    footerNote: "Rates are informational and may vary across specific branches or mobile banking apps.",
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
    ratesTableTitle: "Bank exchange rate comparison",
    ratesTableSubtitle: "Verified values directly from bank APIs and public feeds.",
    searchBank: "Search bank...",
    faqTitle: "Exchange rate FAQ",
    faqSubtitle: "Clear answers on buying, selling, spreads, and regulator benchmarks.",
    chartUnavailable:
      "Historical charts are fed by NBU official daily records. Live rates are updated above.",
    aiTitle: "AI data",
    bestRateFinderTitle: "Best rates available right now",
    bestRateFinderSubtitle: "Instantly see where to buy or sell foreign currency at the most favorable terms",
    bestToBuyTitle: "Best bank to buy",
    bestToSellTitle: "Best bank to sell",
    whereToBuy: "Lowest price when purchasing foreign currency",
    whereToSell: "Highest price when selling foreign currency",
    insightsTitle: "Market Insights",
    insightsSubtitle: "Spreads, bank pricing variance, and deviations from the central bank",
    nbuDiff: "NBU difference",
    bankSpread: "Average spread",
    marketRange: "Market range",
    adLabel: "Advertisement",
    cookieConsentTitle: "Cookie consent",
    cookieConsentText:
      "We use cookies to preserve your theme preference, ensure reliable functionality, and support advertising partners like Google AdSense.",
    cookieAccept: "Accept all",
    cookieDecline: "Essential only",
    privacyLink: "Privacy Policy",
    termsLink: "Terms of Use",
    aboutLink: "About Us",
    contactLink: "Contact",
  },
} as const;

export const FAQ_UK = [
  {
    question: "Де сьогодні найвигідніший курс долара в Україні?",
    answer:
      "Найкращий курс залежить від того, чи купуєте ви валюту, чи продаєте. Якщо ви купуєте долари — шукайте банк із мінімальним курсом продажу (sell). Якщо продаєте долари — обирайте банк із найвищим курсом купівлі (buy). Блок «Кращий курс» на UAH.today розраховує це автоматично.",
  },
  {
    question: "Що означає курс купівлі та курс продажу?",
    answer:
      "Курс купівлі (Buy) — це ціна, за якою банк купує іноземну валюту у клієнта (клієнт здає валюту й отримує гривні). Курс продажу (Sell) — це ціна, за якою банк продає іноземну валюту клієнту (клієнт платить гривні й отримує валюту).",
  },
  {
    question: "Чим курс НБУ відрізняється від курсів комерційних банків?",
    answer:
      "Офіційний курс НБУ встановлюється Національним банком України за підсумками торгів на міжбанківському ринку і є довідковим для бухгалтерського обліку та митних декларацій. Комерційні банки встановлюють власні курси з урахуванням ринкового попиту та додають свій спред (прибуток).",
  },
  {
    question: "Що таке банківський спред і чому він важливий?",
    answer:
      "Спред — це різниця між курсом продажу та курсом купівлі валюти в одному банку. Чим менший спред, тим менші фінансові втрати несе клієнт під час обміну. Вузький спред зазвичай свідчить про високу ліквідність та стабільність ринку.",
  },
  {
    question: "Як працює розумний конвертер UAH.today?",
    answer:
      "Наш конвертер автоматично визначає тип операції: якщо ви міняєте гривні на валюту, застосовується найкращий банківський курс продажу; якщо міняєте валюту на гривні — найкращий курс купівлі. Ви також можете обрати конкретний банк зі списку для точного розрахунку.",
  },
  {
    question: "Як часто оновлюються дані на платформі?",
    answer:
      "Дані офіційного API НБУ та PrivatBank оновлюються щокварталу години. monobank кешується до 30 хвилин через технічні ліміти регулювання запитів. Усі джерела супроводжуються позначкою актуальності.",
  },
];

export const FAQ_EN = [
  {
    question: "How do I find the best USD to UAH rate today?",
    answer:
      "The best rate depends on whether you are buying or selling foreign currency. If you want to buy USD, look for the lowest selling rate (bank sells to you). If you want to sell USD for UAH, look for the highest buying rate (bank buys from you). UAH.today's 'Best Rate Finder' highlights both options automatically.",
  },
  {
    question: "What is the difference between Buy and Sell rates?",
    answer:
      "The Buy rate is the price a commercial bank pays to purchase foreign currency from a customer. The Sell rate is the price a customer pays when buying foreign currency from a bank.",
  },
  {
    question: "How does the official NBU rate differ from commercial bank rates?",
    answer:
      "The NBU official rate is set daily by the National Bank of Ukraine based on interbank transactions and serves as a benchmark for accounting and customs. Commercial banks set their own retail cash rates to account for market supply, demand, and operational margins.",
  },
  {
    question: "What is an FX spread?",
    answer:
      "The spread is the difference between a bank's selling price and buying price. A narrower spread means lower transaction costs for customers during currency exchange.",
  },
  {
    question: "How frequently is the data updated?",
    answer:
      "Official rates from NBU and major retail banks are fetched and cached with 15-to-30 minute validation windows to respect API rate limits and provide real-time accuracy.",
  },
];

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const root = process.cwd();
const templatePath = join(root, "dist", "index.html");

if (!existsSync(templatePath)) {
  console.error("dist/index.html not found. Run vite build first.");
  process.exit(1);
}

const template = readFileSync(templatePath, "utf8");

const routes = [
  {
    path: "/",
    title: "Курс валют в Україні сьогодні: долар, євро, НБУ | UAH.today",
    description: "Порівняння курсів валют у банках України. Знайдіть найкращий курс купівлі та продажу USD, EUR, PLN, GBP і CHF на UAH.today.",
    locale: "uk",
    h1: "Знайдіть найкращий курс валют в Україні",
    lead: "Незалежний моніторинг курсів готівкової валюти в банках України та офіційного курсу НБУ.",
  },
  {
    path: "/kurs-dolara",
    title: "Курс долара сьогодні в банках України: купівля та продаж USD | UAH.today",
    description: "Де сьогодні вигідніше купити або продати долар США? Актуальні котирування в ПриватБанку, monobank, Райффайзен, Ощадбанку та НБУ.",
    locale: "uk",
    h1: "Курс долара сьогодні в банках України (USD/UAH)",
    lead: "Порівняйте курси купівлі та продажу долара у провідних банках України та за офіційним курсом НБУ.",
  },
  {
    path: "/kurs-evro",
    title: "Курс євро сьогодні в Україні: банки, НБУ, обмін EUR | UAH.today",
    description: "Актуальний курс євро до гривні у провідних банках України. Порівняйте спред, котирування купівлі та продажу готівкового EUR.",
    locale: "uk",
    h1: "Курс євро сьогодні в Україні (EUR/UAH)",
    lead: "Актуальні котирування купівлі та продажу євро в банках України з аналізом спреду та порівнянням із НБУ.",
  },
  {
    path: "/kurs-zlotogo",
    title: "Курс польського злотого сьогодні в банках України | PLN UAH | UAH.today",
    description: "Офіційний та готівковий курс польського злотого (PLN) в українських банках. Калькулятор обміну та вигідний продаж.",
    locale: "uk",
    h1: "Курс польського злотого в банках України (PLN/UAH)",
    lead: "Офіційний та комерційний курс злотого до гривні для швидкого обміну та подорожей.",
  },
  {
    path: "/kurs-funta",
    title: "Курс фунта стерлінгів в Україні сьогодні | GBP UAH банки | UAH.today",
    description: "Курс британського фунта стерлінгів (GBP) до гривні в банках та за офіційним курсом НБУ на сьогодні.",
    locale: "uk",
    h1: "Курс британського фунта стерлінгів (GBP/UAH)",
    lead: "Порівняння курсу фунта стерлінгів в українських банках та за офіційним курсом регулятора.",
  },
  {
    path: "/kurs-nbu",
    title: "Офіційний курс НБУ сьогодні: долар, євро, злотий | UAH.today",
    description: "Офіційні курси валют Національного банку України на сьогодні з архівом та порівнянням із комерційними банками.",
    locale: "uk",
    h1: "Офіційний курс НБУ сьогодні",
    lead: "Офіційні котирування валют Національного банку України, які слугують базовим орієнтиром для ринку.",
  },
  {
    path: "/konverter-valyut",
    title: "Конвертер валют онлайн: калькулятор курсу за банками України | UAH.today",
    description: "Розумний конвертер валют онлайн: переведення гривні в долари, євро та злоті за найкращим курсом купівлі та продажу.",
    locale: "uk",
    h1: "Розумний конвертер валют онлайн",
    lead: "Миттєвий розрахунок вартості валюти за реальним курсом купівлі або продажу обраного банку.",
  },
  {
    path: "/kurs-dolara-privatbank",
    title: "Курс долара в ПриватБанку сьогодні: купівля, продаж, картковий курс | UAH.today",
    description: "Актуальний курс долара США в ПриватБанку (Privat24): відділення, картковий обмін, порівняння з НБУ та іншими банками.",
    locale: "uk",
    h1: "Курс долара в ПриватБанку сьогодні",
    lead: "Офіційні дані ПриватБанку для касового та безготівкового обміну USD/UAH.",
  },
  {
    path: "/kurs-dolara-monobank",
    title: "Курс долара в monobank сьогодні: котирування купівлі та продажу | UAH.today",
    description: "Курс валют у monobank на сьогодні: безготівковий обмін USD, євро, злотий. Порівняння з курсами регулятора.",
    locale: "uk",
    h1: "Курс долара в monobank сьогодні",
    lead: "Актуальний безготівковий курс USD у застосунку monobank з автоматичним оновленням.",
  },
  {
    path: "/pro-nas",
    title: "Про платформу UAH.today: незалежний моніторинг курсів валют в Україні",
    description: "Дізнайтеся більше про UAH.today: місія платформи, прозорість джерел даних НБУ та банків, редакційні стандарти.",
    locale: "uk",
    h1: "Про платформу UAH.today",
    lead: "Незалежний фінансовий сервіс порівняння курсів валют в банках України.",
  },
  {
    path: "/kontakty",
    title: "Контакти та редакція платформи | UAH.today",
    description: "Зв'яжіться з редакцією UAH.today: технічна підтримка, запити щодо даних API, зворотний зв'язок.",
    locale: "uk",
    h1: "Контакти та редакція",
    lead: "Зв'яжіться з нами з питань верифікації даних, партнерства або технічної підтримки.",
  },
  {
    path: "/privacy-policy",
    title: "Політика конфіденційності | UAH.today",
    description: "Політика конфіденційності та обробки даних веб-сайту UAH.today. Використання файлів cookie та Google AdSense.",
    locale: "uk",
    h1: "Політика конфіденційності",
    lead: "Правила збору, захисту та обробки технічних даних користувачів на платформі UAH.today.",
  },
  {
    path: "/terms",
    title: "Умови використання платформи | UAH.today",
    description: "Правила користування сервісом UAH.today, відмова від відповідальності та умови доступу до відкритих даних.",
    locale: "uk",
    h1: "Умови використання",
    lead: "Правові засади користування сервісом UAH.today та відкритими даними.",
  },
  {
    path: "/reklama",
    title: "Реклама на UAH.today: замовити розміщення, банери, брендування | UAH.today",
    description: "Замовити рекламу на UAH.today — незалежному сервісі порівняння курсів валют у банках України. Банери, брендування конвертера, спонсорські блоки. Заявка у Telegram редакції.",
    locale: "uk",
    h1: "Реклама на UAH.today",
    lead: "Спонсорські лоти, банери та брендування на платформі курсів валют. Заявки — у чат Telegram редакції.",
  },
  // English Routes
  {
    path: "/en",
    title: "Live Exchange Rates in Ukraine Today: USD, EUR, UAH | UAH.today",
    description: "Compare live currency exchange rates across Ukrainian banks and NBU. Find the best buy and sell rates for USD, EUR, PLN, GBP, and CHF.",
    locale: "en",
    h1: "Find the best exchange rate in Ukraine",
    lead: "Independent real-time comparison of cash and card currency rates across Ukrainian banks.",
  },
  {
    path: "/en/usd-uah-rate",
    title: "USD to UAH Rate Today: Best Bank Exchange Rates in Ukraine | UAH.today",
    description: "Find the best bank to buy or sell US Dollars in Ukraine. Live USD quotes from PrivatBank, monobank, Raiffeisen, and NBU.",
    locale: "en",
    h1: "USD to UAH Exchange Rate Today in Ukraine",
    lead: "Compare buy and sell rates for US Dollar across leading Ukrainian retail banks.",
  },
  {
    path: "/en/eur-uah-rate",
    title: "EUR to UAH Exchange Rate Today in Ukrainian Banks | UAH.today",
    description: "Live Euro to Ukrainian Hryvnia rates. Compare bank spreads, buy/sell quotes, and official NBU reference rates.",
    locale: "en",
    h1: "EUR to UAH Exchange Rate Today",
    lead: "Real-time quotes, spread analysis, and bank comparisons for Euro exchange in Ukraine.",
  },
  {
    path: "/en/currency-converter",
    title: "Currency Converter Ukraine: Live UAH USD EUR Calculator | UAH.today",
    description: "Instant currency calculator using the strongest live retail rates across Ukrainian banks. Convert UAH, USD, EUR, and PLN.",
    locale: "en",
    h1: "Smart Ukrainian Currency Converter",
    lead: "Convert UAH, USD, EUR, and PLN using verified live bank exchange rates.",
  },
  {
    path: "/en/exchange-rates-ukraine",
    title: "Exchange Rates Ukraine: Complete Bank Comparison & Guide | UAH.today",
    description: "Comprehensive guide and live comparison table of foreign currencies in Ukraine with transparent source verification.",
    locale: "en",
    h1: "Exchange Rates Ukraine — Live Overview",
    lead: "Compare official NBU benchmark rates with retail cash prices in commercial banks.",
  },
  {
    path: "/en/pln-uah-rate",
    title: "PLN to UAH Rate Today: Polish Zloty in Ukrainian Banks | UAH.today",
    description: "Live Polish zloty exchange rates in Ukrainian banks and the official NBU reference rate. Compare PLN buy and sell quotes, spreads, and the converter.",
    locale: "en",
    h1: "PLN to UAH Exchange Rate Today",
    lead: "Compare buy and sell rates for Polish Zloty across Ukrainian banks and the NBU reference.",
  },
  {
    path: "/en/gbp-uah-rate",
    title: "GBP to UAH Rate Today: British Pound in Ukrainian Banks | UAH.today",
    description: "Current British pound exchange rates in Ukrainian banks with the official NBU benchmark. Compare GBP buy and sell quotes before exchanging.",
    locale: "en",
    h1: "GBP to UAH Exchange Rate Today",
    lead: "Compare British Pound quotes across Ukrainian banks with the official NBU benchmark.",
  },
  {
    path: "/en/nbu-reference-rate",
    title: "Official NBU Rate Today: USD, EUR, GBP, PLN Reference | UAH.today",
    description: "Official National Bank of Ukraine reference rates for USD, EUR, PLN, GBP and CHF with history, archive and comparison to commercial banks.",
    locale: "en",
    h1: "Official NBU Reference Rate Today",
    lead: "Official National Bank of Ukraine rates for major currencies, updated every business day.",
  },
  {
    path: "/en/usd-privatbank",
    title: "USD Rate at PrivatBank Today: Buy, Sell & Card Rates | UAH.today",
    description: "Current US dollar rate at PrivatBank (Privat24): branch and card conversion quotes plus comparison with NBU and other Ukrainian banks.",
    locale: "en",
    h1: "USD Rate at PrivatBank Today",
    lead: "PrivatBank US dollar buy and sell quotes compared with NBU and other Ukrainian banks.",
  },
  {
    path: "/en/usd-monobank",
    title: "USD Rate in monobank Today: Card Exchange Quotes | UAH.today",
    description: "monobank card exchange rates for the US dollar today: online buy and sell quotes, rateCross fallback and comparison with NBU and cash rates.",
    locale: "en",
    h1: "USD Rate in monobank Today",
    lead: "monobank card exchange quotes for the US dollar versus NBU and cash bank rates.",
  },
  {
    path: "/en/about",
    title: "About UAH.today: Independent Currency Platform in Ukraine",
    description: "Learn about UAH.today, our data methodology, bank API integrations, and editorial independence.",
    locale: "en",
    h1: "About UAH.today",
    lead: "Independent Ukrainian fintech service dedicated to transparent exchange rate data.",
  },
  {
    path: "/en/contact",
    title: "Contact Editorial Team | UAH.today",
    description: "Contact UAH.today for data inquiries, editorial questions, and partnership.",
    locale: "en",
    h1: "Contact UAH.today",
    lead: "Get in touch with our team for technical, editorial, or data partnership questions.",
  },
  {
    path: "/en/privacy-policy",
    title: "Privacy Policy | UAH.today",
    description: "UAH.today privacy disclosures, server telemetry, cookie handling, and advertising partner compliance.",
    locale: "en",
    h1: "Privacy Policy",
    lead: "How we protect user privacy and comply with GDPR and digital publisher guidelines.",
  },
  {
    path: "/en/terms",
    title: "Terms of Use | UAH.today",
    description: "Terms and conditions for accessing UAH.today currency data feeds and informational tools.",
    locale: "en",
    h1: "Terms of Use",
    lead: "General legal terms and informational disclaimer for platform visitors.",
  },
  {
    path: "/en/advertising",
    title: "Advertise on UAH.today: Banners, Converter Branding | UAH.today",
    description: "Order advertising on UAH.today — Ukraine's independent currency comparison platform. Banner placements, converter branding, sponsored blocks. Apply via the Telegram chat.",
    locale: "en",
    h1: "Advertise on UAH.today",
    lead: "Sponsored slots, banners and converter branding for brands reaching people exchanging currency right now.",
  },
];

const siteUrl = "https://exchange-rates-ukraine.vercel.app";

for (const r of routes) {
  let html = template;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${r.title}</title>`);

  // Replace Description
  html = html.replace(
    /<meta name="description" content=".*?"\s*\/?>/i,
    `<meta name="description" content="${r.description}" />`,
  );

  // Set html lang
  html = html.replace(/<html lang=".*?"/i, `<html lang="${r.locale}"`);

  // Canonical & OG tags
  const canonical = `${siteUrl}${r.path === "/" ? "" : r.path}`;
  const ogTags = `
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${r.title}" />
    <meta property="og:description" content="${r.description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:locale" content="${r.locale === "en" ? "en_US" : "uk_UA"}" />
    <meta name="twitter:title" content="${r.title}" />
    <meta name="twitter:description" content="${r.description}" />
  `;

  html = html.replace("</head>", `${ogTags}</head>`);

  // Inject initial semantic crawler shell inside root
  const initialShell = `
    <div id="root">
      <main class="ssr-shell max-w-7xl mx-auto px-4 py-8 font-sans">
        <h1 class="text-3xl font-black mb-3">${r.h1}</h1>
        <p class="text-base text-gray-600 mb-6">${r.lead}</p>
        <div class="loading-placeholder py-8 text-center text-sm text-gray-500">
          ${r.locale === "en" ? "Loading verified live bank exchange rates..." : "Завантаження актуальних курсів валют у банках України..."}
        </div>
      </main>
    </div>
  `;

  html = html.replace('<div id="root"></div>', initialShell);

  // Determine output path
  let outFilePath;
  if (r.path === "/") {
    outFilePath = join(root, "dist", "index.html");
  } else {
    const routeDir = join(root, "dist", r.path.replace(/^\//, ""));
    if (!existsSync(routeDir)) {
      mkdirSync(routeDir, { recursive: true });
    }
    outFilePath = join(routeDir, "index.html");
  }

  writeFileSync(outFilePath, html, "utf8");
}

console.log(`Prerender complete: ${routes.length} static SEO HTML pages generated.`);

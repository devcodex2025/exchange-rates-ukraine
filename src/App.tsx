import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes, useLocation } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { Terms } from "./pages/Terms";
import { SkillsPage } from "./pages/SkillsPage";
import { AddBankPage } from "./pages/AddBankPage";
import { AdvertisePage } from "./pages/AdvertisePage";
import { NotFound } from "./pages/NotFound";
import { CookieConsent } from "./components/CookieConsent";
import { SiteHeader } from "./components/SiteHeader";
import { FAQ_EN, FAQ_UK, Locale, SITE_URL, UI_COPY } from "./constants";
import { RawRatesResponse } from "./lib/rates";
import { ArrowUpRight } from "lucide-react";

interface RouteMetaItem {
  title: string;
  description: string;
  locale: Locale;
}

export const routeMeta: Record<string, RouteMetaItem> = {
  "/": {
    title: "Курс валют в Україні сьогодні: долар, євро, НБУ | UAH.today",
    description: "Порівняння курсів валют у банках України. Знайдіть найкращий курс купівлі та продажу USD, EUR, PLN, GBP і CHF на UAH.today.",
    locale: "uk",
  },
  "/kurs-dolara": {
    title: "Курс долара сьогодні в банках України: купівля та продаж USD | UAH.today",
    description: "Де сьогодні вигідніше купити або продати долар США? Актуальні котирування в ПриватБанку, monobank, Райффайзен, Ощадбанку та НБУ.",
    locale: "uk",
  },
  "/kurs-evro": {
    title: "Курс євро сьогодні в Україні: банки, НБУ, обмін EUR | UAH.today",
    description: "Актуальний курс євро до гривні у провідних банках України. Порівняйте спред, котирування купівлі та продажу готівкового EUR.",
    locale: "uk",
  },
  "/kurs-zlotogo": {
    title: "Курс польського злотого сьогодні в банках України | PLN UAH | UAH.today",
    description: "Офіційний та готівковий курс польського злотого (PLN) в українських банках. Калькулятор обміну та вигідний продаж.",
    locale: "uk",
  },
  "/kurs-funta": {
    title: "Курс фунта стерлінгів в Україні сьогодні | GBP UAH банки | UAH.today",
    description: "Курс британського фунта стерлінгів (GBP) до гривні в банках та за офіційним курсом НБУ на сьогодні.",
    locale: "uk",
  },
  "/kurs-nbu": {
    title: "Офіційний курс НБУ сьогодні: долар, євро, злотий | UAH.today",
    description: "Офіційні курси валют Національного банку України на сьогодні з архівом та порівнянням із комерційними банками.",
    locale: "uk",
  },
  "/konverter-valyut": {
    title: "Конвертер валют онлайн: калькулятор курсу за банками України | UAH.today",
    description: "Розумний конвертер валют онлайн: переведення гривні в долари, євро та злоті за найкращим курсом купівлі та продажу.",
    locale: "uk",
  },
  "/kurs-dolara-privatbank": {
    title: "Курс долара в ПриватБанку сьогодні: купівля, продаж, картковий курс | UAH.today",
    description: "Актуальний курс долара США в ПриватБанку (Privat24): відділення, картковий обмін, порівняння з НБУ та іншими банками.",
    locale: "uk",
  },
  "/kurs-dolara-monobank": {
    title: "Курс долара в monobank сьогодні: котирування купівлі та продажу | UAH.today",
    description: "Курс валют у monobank на сьогодні: безготівковий обмін USD, євро, злотий. Порівняння з курсами регулятора.",
    locale: "uk",
  },
  "/dodaty-bank": {
    title: "Як додати новий банк: інструкція для контриб'юторів | UAH.today",
    description: "Покрокова інструкція як додати нове джерело курсів у UAH.today через Pull Request на GitHub: сервіс, агрегатор, константи, логотипи, перевірки.",
    locale: "uk",
  },
  "/skills": {
    title: "Скіли UAH.today для AI-агентів: встановлення та API курсів валют | UAH.today",
    description: "Встановіть скіл UAH.today для свого AI-агента: навчіть його використовувати API курсів — банки, monobank, НБУ, історія 7/30/90 днів, конвертація.",
    locale: "uk",
  },
  "/pro-nas": {
    title: "Про платформу UAH.today: незалежний моніторинг курсів валют в Україні",
    description: "Дізнайтеся більше про UAH.today: місія платформи, прозорість джерел даних НБУ та банків, редакційні стандарти.",
    locale: "uk",
  },
  "/kontakty": {
    title: "Контакти та редакція платформи | UAH.today",
    description: "Зв'яжіться з редакцією UAH.today: технічна підтримка, запити щодо даних API, зворотний зв'язок.",
    locale: "uk",
  },
  "/reklama": {
    title: "Реклама на UAH.today: замовити розміщення, банери, брендування | UAH.today",
    description: "Замовити рекламу на UAH.today — незалежному сервісі порівняння курсів валют у банках України. Банери, брендування конвертера, спонсорські блоки. Форма заявки з доставкою в редакцію.",
    locale: "uk",
  },
  "/privacy-policy": {
    title: "Політика конфіденційності | UAH.today",
    description: "Політика конфіденційності та обробки даних веб-сайту UAH.today. Використання файлів cookie та Google AdSense.",
    locale: "uk",
  },
  "/terms": {
    title: "Умови використання платформи | UAH.today",
    description: "Правила користування сервісом UAH.today, відмова від відповідальності та умови доступу до відкритих даних.",
    locale: "uk",
  },

  // English Routes
  "/en": {
    title: "Live Exchange Rates in Ukraine Today: USD, EUR, UAH | UAH.today",
    description: "Compare live currency exchange rates across Ukrainian banks and NBU. Find the best buy and sell rates for USD, EUR, PLN, GBP, and CHF.",
    locale: "en",
  },
  "/en/usd-uah-rate": {
    title: "USD to UAH Rate Today: Best Bank Exchange Rates in Ukraine | UAH.today",
    description: "Find the best bank to buy or sell US Dollars in Ukraine. Live USD quotes from PrivatBank, monobank, Raiffeisen, and NBU.",
    locale: "en",
  },
  "/en/eur-uah-rate": {
    title: "EUR to UAH Exchange Rate Today in Ukrainian Banks | UAH.today",
    description: "Live Euro to Ukrainian Hryvnia rates. Compare bank spreads, buy/sell quotes, and official NBU reference rates.",
    locale: "en",
  },
  "/en/pln-uah-rate": {
    title: "PLN to UAH Rate Today: Polish Zloty in Ukrainian Banks | UAH.today",
    description: "Live Polish zloty exchange rates in Ukrainian banks and the official NBU reference rate. Compare PLN buy and sell quotes, spreads, and the converter.",
    locale: "en",
  },
  "/en/gbp-uah-rate": {
    title: "GBP to UAH Rate Today: British Pound in Ukrainian Banks | UAH.today",
    description: "Current British pound exchange rates in Ukrainian banks with the official NBU benchmark. Compare GBP buy and sell quotes before exchanging.",
    locale: "en",
  },
  "/en/nbu-reference-rate": {
    title: "Official NBU Rate Today: USD, EUR, GBP, PLN Reference | UAH.today",
    description: "Official National Bank of Ukraine reference rates for USD, EUR, PLN, GBP and CHF with history, archive and comparison to commercial banks.",
    locale: "en",
  },
  "/en/usd-privatbank": {
    title: "USD Rate at PrivatBank Today: Buy, Sell & Card Rates | UAH.today",
    description: "Current US dollar rate at PrivatBank (Privat24): branch and card conversion quotes plus comparison with NBU and other Ukrainian banks.",
    locale: "en",
  },
  "/en/usd-monobank": {
    title: "USD Rate in monobank Today: Card Exchange Quotes | UAH.today",
    description: "monobank card exchange rates for the US dollar today: online buy and sell quotes, rateCross fallback and comparison with NBU and cash rates.",
    locale: "en",
  },
  "/en/currency-converter": {
    title: "Currency Converter Ukraine: Live UAH USD EUR Calculator | UAH.today",
    description: "Instant currency calculator using the strongest live retail rates across Ukrainian banks. Convert UAH, USD, EUR, and PLN.",
    locale: "en",
  },
  "/en/exchange-rates-ukraine": {
    title: "Exchange Rates Ukraine: Complete Bank Comparison & Guide | UAH.today",
    description: "Comprehensive guide and live comparison table of foreign currencies in Ukraine with transparent source verification.",
    locale: "en",
  },
  "/en/about": {
    title: "About UAH.today: Independent Currency Platform in Ukraine",
    description: "Learn about UAH.today, our data methodology, bank API integrations, and editorial independence.",
    locale: "en",
  },
  "/en/contact": {
    title: "Contact Editorial Team | UAH.today",
    description: "Contact UAH.today for data inquiries, editorial questions, and partnership.",
    locale: "en",
  },
  "/en/advertising": {
    title: "Advertise on UAH.today: Banners, Converter Branding | UAH.today",
    description: "Order advertising on UAH.today — Ukraine's independent currency comparison platform. Banner placements, converter branding, sponsored blocks. Submit the advertising request form.",
    locale: "en",
  },
  "/en/privacy-policy": {
    title: "Privacy Policy | UAH.today",
    description: "UAH.today privacy disclosures, server telemetry, cookie handling, and advertising partner compliance.",
    locale: "en",
  },
  "/en/add-bank": {
    title: "Add a New Bank: Contributor Guide | UAH.today",
    description: "Step-by-step guide for adding a new rate source to UAH.today via a GitHub Pull Request: service, aggregator, constants, logos, checks.",
    locale: "en",
  },
  "/en/skills": {
    title: "UAH.today Skills for AI Agents: Install Guide & Rates API | UAH.today",
    description: "Install the UAH.today skill for your AI agent: teach it to use the rates API — banks, monobank, NBU, 7/30/90-day history, conversion math.",
    locale: "en",
  },
  "/en/terms": {
    title: "Terms of Use | UAH.today",
    description: "Terms and conditions for accessing UAH.today currency data feeds and informational tools.",
    locale: "en",
  },
};

const dashboardPaths = [
  "/",
  "/kurs-dolara",
  "/kurs-evro",
  "/kurs-zlotogo",
  "/kurs-funta",
  "/kurs-nbu",
  "/konverter-valyut",
  "/kurs-dolara-privatbank",
  "/kurs-dolara-monobank",
  "/en",
  "/en/usd-uah-rate",
  "/en/eur-uah-rate",
  "/en/pln-uah-rate",
  "/en/gbp-uah-rate",
  "/en/nbu-reference-rate",
  "/en/usd-privatbank",
  "/en/usd-monobank",
  "/en/currency-converter",
  "/en/exchange-rates-ukraine",
];

const setHeadTag = (selector: string, attr: "content" | "href", value: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!element) {
    element = selector.startsWith("link") ? document.createElement("link") : document.createElement("meta");
    const match = selector.match(/\[(name|property|rel)="([^"]+)"\]/);
    if (match) element.setAttribute(match[1], match[2]);
    document.head.appendChild(element);
  }
  element.setAttribute(attr, value);
};

const setAlternateLinks = (pathname: string) => {
  document.head.querySelectorAll('link[data-managed-hreflang="true"]').forEach((element) => element.remove());

  const isEn = pathname.startsWith("/en");
  const baseEn = isEn ? pathname : `/en${pathname === "/" ? "" : pathname}`;
  const baseUk = isEn ? (pathname.replace(/^\/en/, "") || "/") : pathname;

  [
    ["uk", `${SITE_URL}${baseUk}`],
    ["en", `${SITE_URL}${baseEn}`],
    ["x-default", `${SITE_URL}/`],
  ].forEach(([hreflang, href]) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.hreflang = hreflang;
    link.href = href;
    link.dataset.managedHreflang = "true";
    document.head.appendChild(link);
  });
};

const SeoManager: React.FC<{ locale: Locale; setLocale: (locale: Locale) => void }> = ({ setLocale }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const meta = routeMeta[pathname] || (pathname.startsWith("/en") ? routeMeta["/en"] : routeMeta["/"]);
    setLocale(meta.locale);
    document.documentElement.lang = meta.locale;
    document.title = meta.title;

    const canonical = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
    setHeadTag('meta[name="description"]', "content", meta.description);
    setHeadTag('meta[name="robots"]', "content", "index, follow, max-image-preview:large");
    setHeadTag('meta[property="og:title"]', "content", meta.title);
    setHeadTag('meta[property="og:description"]', "content", meta.description);
    setHeadTag('meta[property="og:url"]', "content", canonical);
    setHeadTag('meta[property="og:type"]', "content", "website");
    setHeadTag('meta[property="og:site_name"]', "content", "UAH.today");
    setHeadTag('meta[property="og:locale"]', "content", meta.locale === "en" ? "en_US" : "uk_UA");
    setHeadTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setHeadTag('meta[name="twitter:title"]', "content", meta.title);
    setHeadTag('meta[name="twitter:description"]', "content", meta.description);
    setHeadTag('link[rel="canonical"]', "href", canonical);
    setAlternateLinks(pathname);

    const faq = meta.locale === "en" ? FAQ_EN : FAQ_UK;
    const schema = [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "UAH.today",
        url: SITE_URL,
        inLanguage: ["uk", "en"],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: meta.title,
        description: meta.description,
        url: canonical,
        inLanguage: meta.locale,
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "UAH.today",
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: meta.locale === "en" ? "Home" : "Головна", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: meta.title, item: canonical },
        ],
      },
    ];

    let script = document.getElementById("structured-data");
    if (!script) {
      script = document.createElement("script");
      script.id = "structured-data";
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [pathname, setLocale]);

  return null;
};

const RouteTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <div key={pathname} className="page-enter flex flex-col gap-8 sm:gap-12">
      {children}
    </div>
  );
};

export default function App() {
  const [data, setData] = useState<RawRatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("uk");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      // White is the default theme; dark mode only applies when picked explicitly.
      return localStorage.getItem("uah_theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("uah_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("uah_theme", "light");
    }

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", darkMode ? "#121212" : "#ffffff");
  }, [darkMode]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/rates");
      if (!response.ok) throw new Error(locale === "en" ? "Failed to load exchange rates." : "Не вдалося завантажити курси валют.");
      setData(await response.json());
    } catch (err) {
      console.error("Rates request failed:", err);
      setError(
        locale === "en"
          ? "Could not load exchange rates. Check your connection and try again."
          : "Не вдалося завантажити курси валют. Перевірте з'єднання та спробуйте ще раз.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copy = UI_COPY[locale];
  const isEnglish = locale === "en";

  return (
    <Router>
      <SeoManager locale={locale} setLocale={setLocale} />
      <div className="min-h-screen overflow-x-clip bg-[var(--surface-primary)] text-slate-900 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-[#121212] dark:text-slate-100">

        {/* Skip to content — B10 Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          {locale === "en" ? "Skip to content" : "Перейти до змісту"}
        </a>
        
        {/* Floating Navigation Island per rule B7 */}
        <SiteHeader locale={locale} darkMode={darkMode} setDarkMode={setDarkMode} />

        {/* Main Content Area */}
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:gap-12 sm:px-6 lg:px-8">
          <RouteTransition>
            <Routes>
            {dashboardPaths.map((path) => (
              <React.Fragment key={path}>
                <Route
                  path={path}
                  element={
                    <Dashboard
                      data={data}
                      error={error}
                      fetchData={fetchData}
                      loading={loading}
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      locale={locale}
                      setLocale={setLocale}
                    />
                  }
                />
              </React.Fragment>
            ))}

            {/* Mandatory Policy & Info Pages (UA & EN) */}
            <Route path="/pro-nas" element={<About locale="uk" />} />
            <Route path="/about" element={<About locale="uk" />} />
            <Route path="/en/about" element={<About locale="en" />} />

            <Route path="/skills" element={<SkillsPage locale="uk" />} />
            <Route path="/en/skills" element={<SkillsPage locale="en" />} />

            <Route path="/dodaty-bank" element={<AddBankPage locale="uk" />} />
            <Route path="/en/add-bank" element={<AddBankPage locale="en" />} />

            <Route path="/kontakty" element={<Contact locale="uk" />} />
            <Route path="/contact" element={<Contact locale="uk" />} />
            <Route path="/en/contact" element={<Contact locale="en" />} />

            <Route path="/reklama" element={<AdvertisePage locale="uk" />} />
            <Route path="/advertising" element={<AdvertisePage locale="uk" />} />
            <Route path="/en/advertising" element={<AdvertisePage locale="en" />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy locale="uk" />} />
            <Route path="/privacy" element={<PrivacyPolicy locale="uk" />} />
            <Route path="/en/privacy-policy" element={<PrivacyPolicy locale="en" />} />

            <Route path="/terms" element={<Terms locale="uk" />} />
            <Route path="/en/terms" element={<Terms locale="en" />} />

            {/* 404 fallback */}
            <Route
              path="*"
              element={<NotFound locale={locale} />}
            />
            </Routes>
          </RouteTransition>
        </div>

        {/* Full Footer with SEO Sitemap & Legal Links · ui8 inspired gradient atmosphere */}
        <footer className="footer-shell relative mt-16 overflow-hidden text-xs text-slate-500 dark:text-[#ADB7BE]">
            <div aria-hidden="true" className="footer-hairline" />
            <div aria-hidden="true" className="footer-glow absolute inset-x-0 top-0 h-full" />
            <div className="relative mx-auto flex max-w-7xl flex-col gap-8 py-10 px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">UAH.today</p>
                <p className="mt-2 leading-5 text-slate-600 dark:text-[#ADB7BE]">
                  {isEnglish
                    ? "Independent Ukrainian currency comparison platform. Compare live bank rates, find the best deal, and convert money in seconds."
                    : "Незалежний фінансовий сервіс порівняння курсів валют в банках України. Знаходьте найвигідніший курс за лічені секунди."}
                </p>
                <p className="mt-3 text-xs text-slate-500">
                  &copy; {new Date().getFullYear()} UAH.today. {isEnglish ? "All rights reserved." : "Всі права захищено."}
                </p>
              </div>

              <div>
                <p className="font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  {isEnglish ? "Currencies" : "Курси валют"}
                </p>
                <ul className="mt-3 space-y-2 font-medium">
                  <li><Link to={isEnglish ? "/en/usd-uah-rate" : "/kurs-dolara"} className="transition hover:text-brand-700">{isEnglish ? "USD rate (US Dollar)" : "Курс долара (USD)"}</Link></li>
                  <li><Link to={isEnglish ? "/en/eur-uah-rate" : "/kurs-evro"} className="transition hover:text-brand-700">{isEnglish ? "EUR rate (Euro)" : "Курс євро (EUR)"}</Link></li>
                  <li><Link to={isEnglish ? "/en/pln-uah-rate" : "/kurs-zlotogo"} className="transition hover:text-brand-700">{isEnglish ? "PLN rate (Polish Zloty)" : "Курс злотого (PLN)"}</Link></li>
                  <li><Link to={isEnglish ? "/en/gbp-uah-rate" : "/kurs-funta"} className="transition hover:text-brand-700">{isEnglish ? "GBP rate (British Pound)" : "Курс фунта (GBP)"}</Link></li>
                  <li><Link to={isEnglish ? "/en/nbu-reference-rate" : "/kurs-nbu"} className="transition hover:text-brand-700">{isEnglish ? "Official NBU rate" : "Офіційний курс НБУ"}</Link></li>
                </ul>
              </div>

              <div>
                <p className="font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  {isEnglish ? "Banks & Tools" : "Банки та інструменти"}
                </p>
                <ul className="mt-3 space-y-2 font-medium">
                  <li><Link to="/konverter-valyut" className="transition hover:text-brand-700">{copy.converter}</Link></li>
                  <li><Link to={isEnglish ? "/en/usd-privatbank" : "/kurs-dolara-privatbank"} className="transition hover:text-brand-700">{isEnglish ? "Rate at PrivatBank" : "Курс у ПриватБанку"}</Link></li>
                  <li><Link to={isEnglish ? "/en/usd-monobank" : "/kurs-dolara-monobank"} className="transition hover:text-brand-700">{isEnglish ? "Rate in monobank" : "Курс у monobank"}</Link></li>
                  <li><a href="/api/rates" target="_blank" rel="noreferrer" className="learn-more inline-flex items-center gap-1 transition hover:text-brand-700">API /rates <ArrowUpRight className="learn-more-icon" size={12} /></a></li>
                  <li><Link to={isEnglish ? "/en/skills" : "/skills"} className="transition hover:text-brand-700">{isEnglish ? "Skills for AI agents" : "Скіли для AI-агентів"}</Link></li>
                  <li><Link to={isEnglish ? "/en/add-bank" : "/dodaty-bank"} className="transition hover:text-brand-700">{isEnglish ? "Add your bank" : "Додати банк"}</Link></li>
                  <li><a href="/llms.txt" target="_blank" rel="noreferrer" className="learn-more inline-flex items-center gap-1 transition hover:text-brand-700">llms.txt <ArrowUpRight className="learn-more-icon" size={12} /></a></li>
                </ul>
              </div>

              <div>
                <p className="font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
                  {isEnglish ? "About & Legal" : "Інформація та правила"}
                </p>
                <ul className="mt-3 space-y-2 font-medium">
                  <li><Link to={isEnglish ? "/en/about" : "/pro-nas"} className="transition hover:text-brand-700">{copy.aboutLink}</Link></li>
                  <li><a href="https://github.com/devcodex2025/exchange-rates-ukraine" target="_blank" rel="noreferrer" className="learn-more inline-flex items-center gap-1 transition hover:text-brand-700">{isEnglish ? "Open source on GitHub" : "Відкритий код на GitHub"}<ArrowUpRight className="learn-more-icon" size={12} /></a></li>
                  <li><Link to={isEnglish ? "/en/contact" : "/kontakty"} className="transition hover:text-brand-700">{copy.contactLink}</Link></li>
                  <li><Link to={isEnglish ? "/en/advertising" : "/reklama"} className="transition hover:text-brand-700">{isEnglish ? "Advertise with us" : "Реклама на сайті"}</Link></li>
                  <li><Link to={isEnglish ? "/en/privacy-policy" : "/privacy-policy"} className="transition hover:text-brand-700">{copy.privacyLink}</Link></li>
                  <li><Link to={isEnglish ? "/en/terms" : "/terms"} className="transition hover:text-brand-700">{copy.termsLink}</Link></li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("uah_cookie_consent");
                        window.location.reload();
                      }}
                      className="text-left transition hover:text-brand-700"
                    >
                      {isEnglish ? "Reset Cookie Preferences" : "Налаштування файлів cookie"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative border-t border-slate-200/60 pt-4 text-xs leading-5 text-slate-500 dark:border-[#2E2E2E]">
              <p>{copy.footerNote}</p>
            </div>
            </div>
          </footer>

        {/* Cookie Consent */}
        <CookieConsent locale={locale} />
      </div>
    </Router>
  );
}

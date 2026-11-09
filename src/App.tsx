import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes, useLocation } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { Terms } from "./pages/Terms";
import { CookieConsent } from "./components/CookieConsent";
import { FAQ_EN, FAQ_UK, Locale, SITE_URL, UI_COPY } from "./constants";
import { RawRatesResponse } from "./lib/rates";
import { Globe2, Moon, Sun, ArrowUpRight } from "lucide-react";

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
  "/en/privacy-policy": {
    title: "Privacy Policy | UAH.today",
    description: "UAH.today privacy disclosures, server telemetry, cookie handling, and advertising partner compliance.",
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

export default function App() {
  const [data, setData] = useState<RawRatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("uk");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("uah_theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("uah_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("uah_theme", "light");
    }
  }, [darkMode]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/rates");
      if (!response.ok) throw new Error(locale === "en" ? "Failed to load exchange rates." : "Не вдалося завантажити курси валют.");
      setData(await response.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
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
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link to={isEnglish ? "/en" : "/"} className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-950 dark:text-white">
                UAH<span className="text-cyan-600 dark:text-cyan-400">.today</span>
              </span>
              <span className="hidden text-xs font-bold text-slate-500 sm:inline">
                {isEnglish ? "Exchange Rates Ukraine" : "Курси валют в Україні"}
              </span>
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
              <Link to={isEnglish ? "/en/usd-uah-rate" : "/kurs-dolara"} className="hover:text-cyan-600 dark:hover:text-cyan-400">
                {isEnglish ? "USD Rate" : "Курс долара"}
              </Link>
              <Link to={isEnglish ? "/en/eur-uah-rate" : "/kurs-evro"} className="hover:text-cyan-600 dark:hover:text-cyan-400">
                {isEnglish ? "EUR Rate" : "Курс євро"}
              </Link>
              <Link to={isEnglish ? "/en/currency-converter" : "/konverter-valyut"} className="hover:text-cyan-600 dark:hover:text-cyan-400">
                {copy.converter}
              </Link>
              <Link to={isEnglish ? "/en/about" : "/pro-nas"} className="hover:text-cyan-600 dark:hover:text-cyan-400">
                {copy.aboutLink}
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to={isEnglish ? "/" : "/en"}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-black transition hover:bg-slate-100 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <Globe2 size={14} />
                <span>{isEnglish ? "UA" : "EN"}</span>
              </Link>

              <button
                type="button"
                aria-label={isEnglish ? "Toggle dark mode" : "Перемкнути тему"}
                onClick={() => setDarkMode(!darkMode)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
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

            <Route path="/kontakty" element={<Contact locale="uk" />} />
            <Route path="/contact" element={<Contact locale="uk" />} />
            <Route path="/en/contact" element={<Contact locale="en" />} />

            <Route path="/privacy-policy" element={<PrivacyPolicy locale="uk" />} />
            <Route path="/privacy" element={<PrivacyPolicy locale="uk" />} />
            <Route path="/en/privacy-policy" element={<PrivacyPolicy locale="en" />} />

            <Route path="/terms" element={<Terms locale="uk" />} />
            <Route path="/en/terms" element={<Terms locale="en" />} />

            {/* Fallback */}
            <Route
              path="*"
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
          </Routes>

          {/* Full Footer with SEO Sitemap & Legal Links */}
          <footer className="mt-12 flex flex-col gap-8 border-t border-slate-200 py-10 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {/* Col 1: Brand & Identity */}
              <div>
                <p className="text-base font-black text-slate-900 dark:text-white">UAH.today</p>
                <p className="mt-2 leading-5">
                  {isEnglish
                    ? "Independent Ukrainian currency comparison platform. Compare live bank rates, find the best deal, and convert money in seconds."
                    : "Незалежний фінансовий сервіс порівняння курсів валют в банках України. Знаходьте найвигідніший курс за лічені секунди."}
                </p>
                <p className="mt-3 text-[11px] text-slate-400">
                  &copy; {new Date().getFullYear()} UAH.today. {isEnglish ? "All rights reserved." : "Всі права захищено."}
                </p>
              </div>

              {/* Col 2: Currency Rates */}
              <div>
                <p className="font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {isEnglish ? "Currencies" : "Курси валют"}
                </p>
                <ul className="mt-3 space-y-2 font-medium">
                  <li><Link to="/kurs-dolara" className="hover:text-cyan-600">Курс долара (USD)</Link></li>
                  <li><Link to="/kurs-evro" className="hover:text-cyan-600">Курс євро (EUR)</Link></li>
                  <li><Link to="/kurs-zlotogo" className="hover:text-cyan-600">Курс злотого (PLN)</Link></li>
                  <li><Link to="/kurs-funta" className="hover:text-cyan-600">Курс фунта (GBP)</Link></li>
                  <li><Link to="/kurs-nbu" className="hover:text-cyan-600">Офіційний курс НБУ</Link></li>
                </ul>
              </div>

              {/* Col 3: Popular Banks & Tools */}
              <div>
                <p className="font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {isEnglish ? "Banks & Tools" : "Банки та інструменти"}
                </p>
                <ul className="mt-3 space-y-2 font-medium">
                  <li><Link to="/konverter-valyut" className="hover:text-cyan-600">{copy.converter}</Link></li>
                  <li><Link to="/kurs-dolara-privatbank" className="hover:text-cyan-600">Курс у ПриватБанку</Link></li>
                  <li><Link to="/kurs-dolara-monobank" className="hover:text-cyan-600">Курс у monobank</Link></li>
                  <li><a href="/api/rates" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-600">API /rates <ArrowUpRight size={12} /></a></li>
                  <li><a href="/llms.txt" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-600">llms.txt <ArrowUpRight size={12} /></a></li>
                </ul>
              </div>

              {/* Col 4: Legal & Policy */}
              <div>
                <p className="font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {isEnglish ? "About & Legal" : "Інформація та правила"}
                </p>
                <ul className="mt-3 space-y-2 font-medium">
                  <li><Link to={isEnglish ? "/en/about" : "/pro-nas"} className="hover:text-cyan-600">{copy.aboutLink}</Link></li>
                  <li><Link to={isEnglish ? "/en/contact" : "/kontakty"} className="hover:text-cyan-600">{copy.contactLink}</Link></li>
                  <li><Link to={isEnglish ? "/en/privacy-policy" : "/privacy-policy"} className="hover:text-cyan-600">{copy.privacyLink}</Link></li>
                  <li><Link to={isEnglish ? "/en/terms" : "/terms"} className="hover:text-cyan-600">{copy.termsLink}</Link></li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        localStorage.removeItem("uah_cookie_consent");
                        window.location.reload();
                      }}
                      className="text-left hover:text-cyan-600"
                    >
                      {isEnglish ? "Reset Cookie Preferences" : "Налаштування файлів cookie"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-4 text-[11px] leading-5 text-slate-400 dark:border-slate-800/60">
              <p>{copy.footerNote}</p>
            </div>
          </footer>
        </div>

        {/* GDPR & AdSense Compliant Cookie Consent Banner */}
        <CookieConsent locale={locale} />
      </div>
    </Router>
  );
}

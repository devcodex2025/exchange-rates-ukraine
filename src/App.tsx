import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes, useLocation } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { About } from "./pages/About";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { FAQ_EN, FAQ_UK, Locale, SITE_URL, UI_COPY } from "./constants";
import { RawRatesResponse } from "./lib/rates";

const routeMeta: Record<string, { title: string; description: string; locale: Locale }> = {
  "/": {
    title: "Курс валют в Україні сьогодні: долар, євро, НБУ | UAH.today",
    description: "Актуальний курс долара, євро, злотого та фунта в банках України. Порівняння курсів купівлі, продажу, НБУ і конвертер валют.",
    locale: "uk",
  },
  "/kurs-dolara": {
    title: "Курс долара сьогодні в Україні | USD UAH банки та НБУ",
    description: "Порівняйте курс долара до гривні в PrivatBank, monobank, Raiffeisen, Ощадбанку, ПУМБ та НБУ.",
    locale: "uk",
  },
  "/kurs-evro": {
    title: "Курс євро сьогодні в Україні | EUR UAH банки та НБУ",
    description: "Актуальний курс євро до гривні у провідних банках України, офіційний курс НБУ і конвертер EUR UAH.",
    locale: "uk",
  },
  "/kurs-nbu": {
    title: "Курс НБУ сьогодні | Офіційний курс валют",
    description: "Офіційний курс НБУ для USD, EUR, PLN, GBP та інших валют з поясненням різниці між НБУ і банківськими курсами.",
    locale: "uk",
  },
  "/konverter-valyut": {
    title: "Конвертер валют онлайн | USD EUR UAH",
    description: "Швидкий конвертер валют за актуальними курсами банків України та НБУ.",
    locale: "uk",
  },
  "/kurs-dolara-privatbank": {
    title: "Курс долара ПриватБанк сьогодні | USD UAH",
    description: "Курс долара в ПриватБанку: купівля, продаж, порівняння з НБУ та іншими банками України.",
    locale: "uk",
  },
  "/kurs-dolara-monobank": {
    title: "Курс долара monobank сьогодні | USD UAH",
    description: "Курс долара в monobank: актуальна купівля, продаж, порівняння з НБУ та іншими банками.",
    locale: "uk",
  },
  "/en": {
    title: "Live Exchange Rates in Ukraine: USD, EUR, UAH | UAH.today",
    description: "Compare USD to UAH, EUR to UAH, bank rates and NBU exchange rates in Ukraine with a live currency converter.",
    locale: "en",
  },
  "/en/usd-uah-rate": {
    title: "USD to UAH Rate Today | Ukraine Bank Exchange Rates",
    description: "Live USD to UAH exchange rate in Ukrainian banks, including NBU, PrivatBank and monobank.",
    locale: "en",
  },
  "/en/eur-uah-rate": {
    title: "EUR to UAH Rate Today | Ukraine Bank Exchange Rates",
    description: "Live EUR to UAH exchange rate in Ukrainian banks and official NBU rate.",
    locale: "en",
  },
  "/en/currency-converter": {
    title: "Currency Converter UAH | USD EUR Ukraine",
    description: "Convert UAH, USD, EUR and PLN using current Ukrainian bank exchange rates.",
    locale: "en",
  },
  "/en/exchange-rates-ukraine": {
    title: "Exchange Rates Ukraine | Bank and NBU Rates",
    description: "Real-time exchange rates in Ukraine for USD, EUR, PLN and GBP with bank comparison.",
    locale: "en",
  },
  "/en/best-exchange-rate-ukraine": {
    title: "Best Exchange Rate Ukraine | Compare Banks",
    description: "Find the best available exchange rate in Ukraine by comparing buy and sell rates across banks.",
    locale: "en",
  },
};

const dashboardPaths = Object.keys(routeMeta);

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

const setAlternateLinks = () => {
  document.head.querySelectorAll('link[data-managed-hreflang="true"]').forEach((element) => element.remove());
  [
    ["uk", `${SITE_URL}/`],
    ["en", `${SITE_URL}/en`],
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

const SeoManager: React.FC<{ locale: Locale; setLocale: (locale: Locale) => void }> = ({ locale, setLocale }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const meta = routeMeta[pathname] || routeMeta["/"];
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
    setHeadTag('meta[property="og:image"]', "content", `${SITE_URL}/hero-mobile.webp`);
    setHeadTag('meta[name="twitter:card"]', "content", "summary_large_image");
    setHeadTag('meta[name="twitter:title"]', "content", meta.title);
    setHeadTag('meta[name="twitter:description"]', "content", meta.description);
    setHeadTag('meta[name="twitter:image"]', "content", `${SITE_URL}/hero-mobile.webp`);
    setHeadTag('link[rel="canonical"]', "href", canonical);
    setAlternateLinks();

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
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: "Ukraine exchange rates",
        url: `${SITE_URL}/api/rates`,
        distribution: [{ "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${SITE_URL}/rates.json` }],
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

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
};

export default function App() {
  const [data, setData] = useState<RawRatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("uk");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/rates");
      if (!response.ok) throw new Error(locale === "en" ? "Failed to load rates." : "Не вдалося завантажити курси.");
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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const copy = UI_COPY[locale];

  return (
    <Router>
      <SeoManager locale={locale} setLocale={setLocale} />
      <div className="min-h-screen bg-white text-slate-950 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <Routes>
            {dashboardPaths.map((path) => (
              <React.Fragment key={path}>
                <Route
                  element={
                    <Dashboard
                      data={data}
                      darkMode={darkMode}
                      error={error}
                      fetchData={fetchData}
                      loading={loading}
                      locale={locale}
                      setDarkMode={setDarkMode}
                      setLocale={setLocale}
                    />
                  }
                  path={path}
                />
              </React.Fragment>
            ))}
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>

          <footer className="flex flex-col gap-5 border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-black text-slate-800 dark:text-slate-100">UAH.today</p>
              <p className="mt-1">{copy.footerNote}</p>
            </div>
            <div className="flex flex-wrap gap-4 font-bold">
              <Link to="/kurs-dolara">Курс долара</Link>
              <Link to="/kurs-evro">Курс євро</Link>
              <Link to="/en/exchange-rates-ukraine">EN</Link>
              <Link to="/privacy">{locale === "en" ? "Privacy" : "Конфіденційність"}</Link>
              <Link to="/about">{locale === "en" ? "About" : "Про сайт"}</Link>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

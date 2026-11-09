import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { Locale, UI_COPY } from "../constants";

interface SiteHeaderProps {
  locale: Locale;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const linkBase =
  "relative py-1 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-cyan-700 dark:hover:text-cyan-400";

export const SiteHeader: React.FC<SiteHeaderProps> = ({ locale, darkMode, setDarkMode }) => {
  const isEnglish = locale === "en";
  const copy = UI_COPY[locale];
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const navItems = [
    { to: isEnglish ? "/en" : "/", label: copy.navBest, end: true },
    { to: isEnglish ? "/en/usd-uah-rate" : "/kurs-dolara", label: isEnglish ? "USD" : "Долар" },
    { to: isEnglish ? "/en/eur-uah-rate" : "/kurs-evro", label: isEnglish ? "EUR" : "Євро" },
    { to: isEnglish ? "/en/currency-converter" : "/konverter-valyut", label: copy.converter },
    { to: isEnglish ? "/en/about" : "/pro-nas", label: copy.aboutLink },
  ];

  return (
    <div className="sticky top-4 z-40 mx-auto max-w-5xl px-4 sm:px-6">
      <header className="flex h-14 items-center justify-between rounded-2xl border border-slate-200/90 bg-white/85 px-4 shadow-sm backdrop-blur-md transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-[#272727] dark:bg-[#181818]/85 sm:px-6">
        <Link to={isEnglish ? "/en" : "/"} className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
            UAH<span className="text-cyan-700 dark:text-cyan-400">.today</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? "text-slate-950 dark:text-white" : ""}`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-cyan-700 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-cyan-400 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={isEnglish ? "/" : "/en"}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-slate-100 active:scale-[0.98] dark:border-[#313131] dark:bg-[#1F1F1F] dark:text-slate-300 dark:hover:bg-[#272727]"
          >
            <Globe2 size={14} />
            <span>{isEnglish ? "UA" : "EN"}</span>
          </Link>

          <button
            type="button"
            aria-label={
              darkMode
                ? isEnglish
                  ? "Switch to light theme"
                  : "Увімкнути світлу тему"
                : isEnglish
                  ? "Switch to dark theme"
                  : "Увімкнути темну тему"
            }
            aria-pressed={darkMode}
            onClick={() => setDarkMode(!darkMode)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-slate-100 active:scale-[0.98] dark:border-[#313131] dark:bg-[#1F1F1F] dark:text-slate-300 dark:hover:bg-[#272727]"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button
            type="button"
            aria-label={isEnglish ? "Open menu" : "Відкрити меню"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-slate-100 active:scale-[0.98] dark:border-[#313131] dark:bg-[#1F1F1F] dark:text-slate-300 dark:hover:bg-[#272727] md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={isEnglish ? "Site menu" : "Меню сайту"}
          className="menu-panel fixed inset-0 z-50 md:hidden"
        >
          <div
            aria-hidden="true"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 h-full w-full bg-white/95 backdrop-blur-xl dark:bg-[#000000]/95"
          />

          <div className="relative flex h-full flex-col px-6 py-4">
            <div className="flex h-14 items-center justify-between">
              <span className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">
                UAH<span className="text-cyan-700 dark:text-cyan-400">.today</span>
              </span>
              <button
                type="button"
                aria-label={isEnglish ? "Close menu" : "Закрити меню"}
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-slate-100 active:scale-[0.98] dark:border-[#313131] dark:bg-[#1F1F1F] dark:text-slate-300"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-6">
              {navItems.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMenuOpen(false)}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className={({ isActive }) =>
                    `menu-item text-3xl font-semibold tracking-tight transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isActive
                        ? "text-cyan-700 dark:text-cyan-400"
                        : "text-slate-900 dark:text-slate-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pb-6">
              <Link
                to={isEnglish ? "/" : "/en"}
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-slate-50 active:scale-[0.98] dark:border-[#313131] dark:bg-[#1F1F1F] dark:text-slate-200"
              >
                <Globe2 size={15} />
                {isEnglish ? "Switch to Ukrainian" : "Перейти на англійську"}
              </Link>
              <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                {isEnglish ? "Live rates from Ukrainian banks and the NBU" : "Актуальні курси банків України та НБУ"}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Locale, UI_COPY } from "../constants";

interface CookieConsentProps {
  locale: Locale;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ locale }) => {
  const [visible, setVisible] = useState(false);
  const copy = UI_COPY[locale];

  useEffect(() => {
    const consent = localStorage.getItem("uah_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("uah_cookie_consent", "all");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("uah_cookie_consent", "essential");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label={copy.cookieConsentTitle}
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 sm:bottom-6 sm:left-6 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-cyan-600/10 p-2 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400">
          <Cookie size={22} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-black text-slate-950 dark:text-white">
            {copy.cookieConsentTitle}
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
            {copy.cookieConsentText}{" "}
            <a
              href={locale === "en" ? "/en/privacy-policy" : "/privacy-policy"}
              className="font-bold underline hover:text-cyan-700"
            >
              {copy.privacyLink}
            </a>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleAccept}
              className="rounded-lg bg-slate-950 px-3.5 py-1.5 text-xs font-black text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              {copy.cookieAccept}
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {copy.cookieDecline}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDecline}
          aria-label="Close"
          className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X size={16} />
        </button>
      </div>
    </aside>
  );
};

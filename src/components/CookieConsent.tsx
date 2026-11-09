import React, { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { Locale, UI_COPY } from "../constants";

interface CookieConsentProps {
  locale: Locale;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({ locale }) => {
  const [visible, setVisible] = useState(false);
  const elementRef = React.useRef<HTMLElement>(null);
  const copy = UI_COPY[locale];

  useEffect(() => {
    const consent = localStorage.getItem("uah_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  // Modal open / close: flush the closed state, then add .is-open so the
  // scale transition has a start frame.
  React.useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    void element.offsetWidth;
    element.classList.add("is-open");
  }, [visible]);

  const dismiss = (value: "all" | "essential") => {
    localStorage.setItem("uah_cookie_consent", value);
    elementRef.current?.classList.remove("is-open");
    elementRef.current?.classList.add("is-closing");
    window.setTimeout(() => setVisible(false), 180);
  };

  const handleAccept = () => dismiss("all");
  const handleDecline = () => dismiss("essential");

  if (!visible) return null;

  return (
    <aside
      ref={elementRef}
      aria-label={copy.cookieConsentTitle}
      className="t-modal fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-[#2E2E2E] dark:bg-[#121212]/95 sm:bottom-6 sm:left-6 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-brand-600/10 p-2 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
          <Cookie size={22} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white">
            {copy.cookieConsentTitle}
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-[#ADB7BE]">
            {copy.cookieConsentText}{" "}
            <a
              href={locale === "en" ? "/en/privacy-policy" : "/privacy-policy"}
              className="font-bold underline hover:text-brand-700"
            >
              {copy.privacyLink}
            </a>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleAccept}
              className="rounded-lg bg-slate-950 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              {copy.cookieAccept}
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98] dark:border-[#2E2E2E] dark:bg-[#202020] dark:text-[#ADB7BE] dark:hover:bg-slate-800"
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

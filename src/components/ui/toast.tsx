import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

interface ToastProps {
  open: boolean;
  message: string;
}

/**
 * Toast open / close from transitions.dev: rises in with fade, blur and scale.
 * Kept mounted through the close transition so it can animate out.
 */
export const Toast: React.FC<ToastProps> = ({ open, message }) => {
  const [mounted, setMounted] = useState(open);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }

    const timer = window.setTimeout(() => setMounted(false), 400);
    return () => window.clearTimeout(timer);
  }, [open]);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (open) {
      // Flush the closed state first so the open transition has a start frame.
      void element.offsetWidth;
      element.classList.add("is-open");
    } else {
      element.classList.remove("is-open");
    }
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <div
        ref={elementRef}
        role="status"
        aria-live="polite"
        className="t-toast inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-2 pl-2 pr-4 text-sm font-semibold text-slate-800 shadow-[0_8px_24px_-8px_rgba(15,23,42,0.2)] dark:border-[#2E2E2E] dark:bg-[#2A2A2A] dark:text-slate-100"
      >
        <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
        {message}
      </div>
    </div>
  );
};

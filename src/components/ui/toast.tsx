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
        className="t-toast rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-lg dark:border-[#313131] dark:bg-[#272727] dark:text-slate-100"
      >
        {message}
      </div>
    </div>
  );
};

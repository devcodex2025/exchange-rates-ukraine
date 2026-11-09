import React, { createContext, useContext, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export const Tabs: React.FC<React.HTMLAttributes<HTMLDivElement> & TabsContextValue> = ({
  className,
  value,
  onValueChange,
  ...props
}) => (
  <TabsContext.Provider value={{ value, onValueChange }}>
    <div className={cn("flex flex-col gap-4", className)} {...props} />
  </TabsContext.Provider>
);

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  const context = useContext(TabsContext);
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const mounted = useRef(false);

  // Tabs sliding: the pill follows the active tab. The first paint and any
  // resize snap without a transition so the pill never animates in from 0.
  useEffect(() => {
    const list = listRef.current;
    const pill = pillRef.current;
    if (!list || !pill) return;

    const place = (animate: boolean) => {
      const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
      if (!active) return;

      if (!animate) pill.style.transition = "none";
      pill.style.transform = `translateX(${active.offsetLeft}px)`;
      pill.style.width = `${active.offsetWidth}px`;
      if (!animate) {
        void pill.offsetWidth;
        pill.style.transition = "";
      }
    };

    const animate = mounted.current;
    place(animate);
    mounted.current = true;

    const onResize = () => place(false);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [context?.value]);

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn(
        "relative inline-flex w-full gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-[#313131] dark:bg-[#1F1F1F]",
        className,
      )}
      {...props}
    >
      <span ref={pillRef} className="tabs-pill" aria-hidden="true" />
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }> = ({
  className,
  value,
  ...props
}) => {
  const context = useContext(TabsContext);
  const active = context?.value === value;

  return (
    <button
      role="tab"
      aria-selected={active ? "true" : "false"}
      className={cn(
        "relative z-[1] shrink-0 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        active
          ? "text-slate-950 dark:text-white"
          : "text-slate-500 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
        className,
      )}
      onClick={() => context?.onValueChange(value)}
      type="button"
      {...props}
    />
  );
};

export const TabsContent: React.FC<React.HTMLAttributes<HTMLDivElement> & { value: string }> = ({
  className,
  value,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (context?.value !== value) return null;
  return <div className={cn("outline-none", className)} {...props} />;
};

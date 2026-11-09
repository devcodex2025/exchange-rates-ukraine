import React, { createContext, useContext } from "react";
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

export const TabsList: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("inline-flex w-full gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-900", className)} {...props} />
);

export const TabsTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }> = ({
  className,
  value,
  ...props
}) => {
  const context = useContext(TabsContext);
  const active = context?.value === value;
  return (
    <button
      className={cn(
        "shrink-0 rounded-md px-3 py-2 text-sm font-black text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white",
        active && "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white",
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

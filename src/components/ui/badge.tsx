import React from "react";
import { cn } from "../../lib/utils";

type BadgeVariant = "default" | "secondary" | "outline" | "success";

const variants: Record<BadgeVariant, string> = {
  default: "border-transparent bg-slate-950 text-white dark:bg-white dark:text-slate-950",
  secondary: "border-transparent bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  outline: "border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200",
  success: "border-transparent bg-emerald-500 text-slate-950",
};

export const Badge: React.FC<React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }> = ({
  className,
  variant = "default",
  ...props
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-black uppercase tracking-wide",
      variants[variant],
      className,
    )}
    {...props}
  />
);

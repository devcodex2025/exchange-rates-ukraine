import React from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "default" | "outline" | "ghost";

const variants: Record<ButtonVariant, string> = {
  default: "bg-emerald-500 text-slate-950 hover:bg-emerald-400",
  outline: "border border-white/25 bg-transparent text-white hover:bg-white/10",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }> = ({
  className,
  variant = "default",
  ...props
}) => (
  <button
    className={cn("inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition active:scale-[0.98] disabled:opacity-60", variants[variant], className)}
    {...props}
  />
);

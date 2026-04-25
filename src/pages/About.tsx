import React from "react";
import { Info, Server, ShieldCheck, Target } from "lucide-react";

export const About: React.FC = () => {
  return (
    <main className="mx-auto max-w-4xl py-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300">
            <Info size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white">About UAH.today</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Live exchange-rate monitoring for Ukraine.</p>
          </div>
        </div>

        <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-300">
          UAH.today helps people compare exchange rates from Ukrainian banks and the National Bank of Ukraine. The product is
          built around transparent definitions, machine-readable data, and a fast mobile-first dashboard.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [Target, "Mission", "Make exchange-rate decisions faster and easier."],
            [Server, "Sources", "NBU, PrivatBank, monobank and existing bank-source logic."],
            [ShieldCheck, "Trust", "No synthetic rates when source data is unavailable."],
          ].map(([Icon, title, body]) => (
            <article className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950" key={String(title)}>
              {React.createElement(Icon as typeof Target, { size: 22, className: "text-cyan-700 dark:text-cyan-300" })}
              <h2 className="mt-3 font-black text-slate-950 dark:text-white">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body as string}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

import React from "react";
import { Eye, Lock, Shield } from "lucide-react";

export const PrivacyPolicy: React.FC = () => {
  return (
    <main className="mx-auto max-w-4xl py-10">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-slate-950 p-3 text-white dark:bg-white dark:text-slate-950">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white">Privacy Policy</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Last updated: April 25, 2026</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-6 text-sm leading-7 text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
              <Eye size={18} /> Data we process
            </h2>
            <p className="mt-2">
              The public dashboard does not require registration. Server logs may contain standard technical information such as IP
              address, browser, request path and time for security and reliability.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
              <Lock size={18} /> Cookies and ads
            </h2>
            <p className="mt-2">
              Theme preference may be stored locally in the browser. Advertising slots are prepared for Google AdSense, which may
              use its own cookies after ads are enabled.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
};

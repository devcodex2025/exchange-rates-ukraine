import React from "react";

interface RatesSkeletonProps {
  label: string;
}

/**
 * Placeholder shaped like the real rate layout per B9, so the first paint does
 * not jump when data arrives.
 */
export const RatesSkeleton: React.FC<RatesSkeletonProps> = ({ label }) => (
  <div role="status" aria-live="polite" className="flex flex-col gap-8">
    <span className="sr-only">{label}</span>

    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-[#2E2E2E] dark:bg-[#202020]">
      <div className="flex items-center gap-3">
        <div className="skeleton h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-48 rounded" />
          <div className="skeleton h-3 w-64 max-w-full rounded" />
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="skeleton h-24 rounded-xl" />
        <div className="skeleton h-24 rounded-xl" />
      </div>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {[0, 1, 2, 3, 4].map((item) => (
        <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#2E2E2E] dark:bg-[#202020]">
          <div className="flex items-center justify-between">
            <div className="skeleton h-5 w-16 rounded" />
            <div className="skeleton h-6 w-10 rounded" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="skeleton h-20 rounded-xl" />
            <div className="skeleton h-20 rounded-xl" />
          </div>
          <div className="skeleton mt-4 h-3 w-24 rounded" />
        </div>
      ))}
    </div>
  </div>
);

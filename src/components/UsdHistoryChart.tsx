import React, { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Locale } from "../constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface HistoryPoint {
  date: string;
  rate: number | null;
}

interface HistoryResponse {
  points?: HistoryPoint[];
  source?: string;
  updatedAt?: string;
}

interface UsdHistoryChartProps {
  locale: Locale;
}

export const UsdHistoryChart: React.FC<UsdHistoryChartProps> = ({ locale }) => {
  const [range, setRange] = useState("7");
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const isEnglish = locale === "en";

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/history?currency=USD&days=${range}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("history unavailable"))))
      .then((payload: HistoryResponse) => {
        setData((payload.points || []).filter((point) => typeof point.rate === "number"));
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [range]);

  const chartData = useMemo(
    () =>
      data.map((point) => ({
        date: new Intl.DateTimeFormat(isEnglish ? "en-US" : "uk-UA", { day: "2-digit", month: "short" }).format(new Date(point.date)),
        rate: point.rate,
      })),
    [data, isEnglish],
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>USD/UAH</CardTitle>
            <CardDescription>
              {isEnglish ? "Official NBU history, no synthetic values." : "Історія офіційного курсу НБУ без синтетичних значень."}
            </CardDescription>
          </div>
          <Tabs value={range} onValueChange={setRange} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="7">7</TabsTrigger>
              <TabsTrigger value="30">30</TabsTrigger>
              <TabsTrigger value="90">90</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -18, right: 12, top: 12, bottom: 0 }}>
                <defs>
                  <linearGradient id="usdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis domain={["dataMin - 0.2", "dataMax + 0.2"]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(4)} UAH`, "USD"]} />
                <Area type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={2.4} fill="url(#usdGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm font-bold text-slate-500 dark:border-slate-800 dark:text-slate-400">
              {loading
                ? isEnglish
                  ? "Loading NBU history..."
                  : "Завантажуємо історію НБУ..."
                : isEnglish
                  ? "Historical data is temporarily unavailable."
                  : "Історичні дані тимчасово недоступні."}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

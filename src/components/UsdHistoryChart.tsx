import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Locale } from "../constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import "./usd-history-chart.css";

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

const RANGES = ["7", "30", "90"];
const STAGE_H = 150;
const STAGE_PAD = 8;

type SoftSpan = HTMLSpanElement & { _uahcTimer?: number };
/**
 * Cross-blur value swap (transitions.dev "value swap" pattern): the previous
 * text blurs out while the new one resolves, and the inline width animates.
 * Imperative port of the reference implementation inside plain React.
 */
const softInto = (el: SoftSpan, next: string, prev: string) => {
  window.clearTimeout(el._uahcTimer);
  const out = document.createElement("span");
  out.className = "uahc-soft-old";
  out.setAttribute("aria-hidden", "true");
  out.textContent = prev;
  const fresh = document.createElement("span");
  fresh.className = "uahc-soft-new";
  fresh.textContent = next;

  const w0 = el.getBoundingClientRect().width;
  el.classList.remove("is-swapping");
  el.replaceChildren(out, fresh);
  const w1 = fresh.getBoundingClientRect().width;
  el.style.width = `${Math.ceil(w0)}px`;
  void el.offsetWidth;
  el.classList.add("is-swapping");
  el.style.width = `${Math.ceil(w1)}px`;
  el._uahcTimer = window.setTimeout(() => {
    el.classList.remove("is-swapping");
    el.style.removeProperty("width");
    el.textContent = next;
    delete el._uahcTimer;
  }, 260);
};

const SoftSwap: React.FC<{ text: string; className?: string }> = React.memo(({ text, className }) => {
  const ref = useRef<SoftSpan>(null);
  const committed = useRef(text);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prev = committed.current;
    committed.current = text;
    if (prev === text) return;
    softInto(el, text, prev);
  }, [text]);

  useEffect(
    () => () => {
      const el = ref.current;
      if (el?._uahcTimer) window.clearTimeout(el._uahcTimer);
    },
    [],
  );

  return <span ref={ref} className={`uahc-soft ${className ?? ""}`.trim()}>{text}</span>;
});

/**
 * USD/UAH history as a candle price card in the transitions.dev "Crypto
 * Candle Chart" style. Honest daily candles: body = previous official NBU
 * close -> current one (no synthetic wicks), crosshair scrub readout and
 * sliding-pill range tabs. Data comes from /api/history {date, rate|null}.
 */
export const UsdHistoryChart: React.FC<UsdHistoryChartProps> = ({ locale }) => {
  const isEnglish = locale === "en";
  const [range, setRange] = useState("7");
  const [data, setData] = useState<{ date: string; rate: number }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [stageW, setStageW] = useState(0);
  const [pillBox, setPillBox] = useState({ x: 0, w: 0, ready: false });

  const stageRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const crossX = useRef(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/history?currency=USD&days=${range}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("history unavailable"))))
      .then((payload: HistoryResponse) => {
        setData(
          (payload.points || [])
            .filter((point) => typeof point.rate === "number")
            .map((point) => ({ date: point.date, rate: point.rate as number })),
        );
      })
      .catch(() => {
        /* keep whatever is already on screen */
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [range]);

  // Stage width drives candle positions/bodies; re-measure on any resize.
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    setStageW(el.clientWidth);
    const observer = new ResizeObserver(() => setStageW(el.clientWidth));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sliding pill: measure the active tab; skip animating the first placement.
  useLayoutEffect(() => {
    const tab = tabRefs.current[RANGES.indexOf(range)];
    if (!tab) return;
    setPillBox({ x: tab.offsetLeft, w: tab.offsetWidth, ready: false });
    window.setTimeout(() => setPillBox((prev) => ({ ...prev, ready: true })), 0);
  }, [range]);

  useEffect(() => {
    const onResize = () => {
      const tab = tabRefs.current[RANGES.indexOf(range)];
      if (tab) setPillBox({ x: tab.offsetLeft, w: tab.offsetWidth, ready: true });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [range]);

  const candles = useMemo(() => {
    if (!data || data.length < 2) return null;
    const open: number[] = data.map((d, i) => (i === 0 ? d.rate : data[i - 1].rate));
    const close: number[] = data.map((d) => d.rate);
    const min = Math.min(...open, ...close);
    const max = Math.max(...open, ...close);
    const y = (v: number) => (max === min ? STAGE_H / 2 : STAGE_PAD + ((max - v) / (max - min)) * (STAGE_H - 2 * STAGE_PAD));
    const count = data.length;
    const step = stageW / count;
    const bodyW = Math.max(2, Math.min(7, Math.floor((step * 0.62) || 2)));
    return { open, close, y, count, step, bodyW };
  }, [data, stageW]);

  const changePct = useMemo(() => {
    if (!data || data.length < 2) return null;
    const first = data[0].rate;
    const last = data[data.length - 1].rate;
    return ((last - first) / first) * 100;
  }, [data]);

  const dateLabels = useMemo(
    () =>
      (data || []).map((point) =>
        new Intl.DateTimeFormat(isEnglish ? "en-US" : "uk-UA", { day: "numeric", month: "short" }).format(
          new Date(`${point.date}T00:00:00`),
        ),
      ),
    [data, isEnglish],
  );

  const stageKey = useMemo(
    () => (data && data.length ? `${range}:${data.length}:${data[0].date}:${data[data.length - 1].rate}` : range),
    [data, range],
  );

  const formatRate = (value: number) =>
    new Intl.NumberFormat(isEnglish ? "en-US" : "uk-UA", { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(value);

  const hasCandles = Boolean(candles);
  const lastRate = data && data.length ? data[data.length - 1].rate : null;
  const hoveredRate = hover !== null && data ? data[hover].rate : null;
  const priceText = lastRate !== null ? `${formatRate(hoveredRate ?? lastRate)} ₴` : "";
  const periodLabel = isEnglish ? `Past ${range} days` : `Останні ${range} днів`;
  const captionText = hover !== null && dateLabels[hover] ? dateLabels[hover] : periodLabel;
  const badgeText =
    changePct === null ? "" : `${changePct >= 0 ? "+" : "\u2212"}${Math.abs(changePct).toFixed(2)}%`;

  const scrub = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!candles || loading) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const index = Math.floor(((event.clientX - rect.left) / rect.width) * candles.count);
    const next = Math.max(0, Math.min(candles.count - 1, index));
    crossX.current = next * candles.step + candles.step / 2;
    setHover(next);
  };
  const release = () => setHover(null);

  const candleNodes = useMemo(() => {
    if (!candles) return null;
    const nodes: React.ReactNode[] = [];
    for (let i = 0; i < candles.count; i++) {
      const o = candles.open[i];
      const c = candles.close[i];
      const top = candles.y(Math.max(o, c));
      const height = Math.max(1, candles.y(Math.min(o, c)) - top);
      const tone = o === c ? "is-flat" : c > o ? "is-up" : "is-down";
      nodes.push(
        <div
          key={i}
          className={`uahc-candle ${tone}${hover === i ? " is-active" : ""}`}
          style={
            {
              left: `${(i * candles.step + (candles.step - candles.bodyW) / 2).toFixed(2)}px`,
              width: `${candles.bodyW}px`,
              "--i": i,
            } as React.CSSProperties
          }
        >
          <span className="uahc-wick" style={{ top: `${top.toFixed(2)}px`, height: `${height.toFixed(2)}px` }} />
          <span className="uahc-body" style={{ top: `${top.toFixed(2)}px`, height: `${Math.max(2, height).toFixed(2)}px` }} />
        </div>,
      );
    }
    return nodes;
  }, [candles, hover]);

  const stageLabel = isEnglish
    ? `Candle chart of the USD/UAH NBU rate for the last ${range} days`
    : `Свічковий графік офіційного курсу USD/UAH за ${range} днів`;
  const showEmpty = !hasCandles && !loading;

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
          {changePct !== null && (
            <span className="uahc uahc-badge shrink-0" data-tone={changePct >= 0 ? "up" : "down"}>
              <SoftSwap text={badgeText} />
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="uahc">
          <div className="uahc-price-block">
            <span className="uahc-price">{priceText}</span>
            <SoftSwap text={captionText} className="uahc-caption" />
          </div>

          <div
            ref={stageRef}
            role="img"
            aria-label={stageLabel}
            className={`uahc-stage${hover !== null ? " is-hover" : ""}${hasCandles ? "" : " is-empty"}`}
            onPointerMove={scrub}
            onPointerDown={scrub}
            onPointerLeave={release}
            onPointerCancel={release}
          >
            <span className="uahc-gridline" style={{ top: 0 }} />
            <span className="uahc-gridline" style={{ top: "50%" }} />
            <span className="uahc-gridline" style={{ bottom: 0 }} />
            {candleNodes && <div key={stageKey}>{candleNodes}</div>}
            <span className="uahc-cross" style={{ transform: `translateX(${crossX.current}px)` }} aria-hidden="true" />
            {showEmpty && (
              <div className="uahc-empty">
                {isEnglish ? "Historical data is temporarily unavailable." : "Історичні дані тимчасово недоступні."}
              </div>
            )}
          </div>

          <p className="uahc-note">
            {isEnglish
              ? "Candle body is one day: from the previous official NBU rate to the current one; weekends and holidays without a rate are omitted."
              : "Тіло свічки — доба: від попереднього офіційного курсу НБУ до нинішнього; вихідні і свята без курсу на графіку відсутні."}
          </p>

          <div className="uahc-tabs" role="tablist" aria-label={isEnglish ? "Range" : "Період"}>
            <span className="uahc-pill" aria-hidden="true" style={{ transform: `translateX(${pillBox.x}px)`, width: `${pillBox.w}px`, transition: pillBox.ready ? undefined : "none" }} />
            {RANGES.map((value, index) => (
              <button
                key={value}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                role="tab"
                aria-selected={range === value}
                className="uahc-tab"
                onClick={() => setRange(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import MagneticButton from "../components/MagneticButton";
import useSEO from "../hooks/useSEO";
import { usePrices } from "../contexts/PricesContext";

/* ─── Types ────────────────────────────────────────────────── */

interface HistoryData {
  gold: number[];
  silver: number[];
  dates: string[];
  range: string;
  fallback: boolean;
}

/* ─── Static Data (purity tables) ──────────────────────────── */

const PURITY: Record<string, { label: string; factor: number }[]> = {
  gold: [
    { label: "24ct", factor: 1.0 },
    { label: "18ct", factor: 0.75 },
    { label: "14ct", factor: 0.583 },
    { label: "9ct", factor: 0.375 },
  ],
  silver: [
    { label: "Standard", factor: 1.0 },
    { label: "Sterling", factor: 0.925 },
  ],
};

/* Fallback static data in case the API fails */
const FALLBACK_GOLD: Record<string, number[]> = {
  "1M": [72.50, 73.10, 71.80, 73.50, 74.20],
  "6M": [62.30, 64.50, 65.80, 67.20, 69.40, 72.50, 74.20],
  "1Y": [55.80, 58.40, 60.20, 62.30, 67.20, 72.50, 74.20],
  "5Y": [42.50, 44.80, 49.20, 55.80, 62.30, 74.20],
};

const FALLBACK_SILVER: Record<string, number[]> = {
  "1M": [0.74, 0.76, 0.75, 0.77, 0.78],
  "6M": [0.68, 0.70, 0.71, 0.73, 0.74, 0.76, 0.78],
  "1Y": [0.62, 0.64, 0.66, 0.68, 0.73, 0.76, 0.78],
  "5Y": [0.52, 0.55, 0.58, 0.62, 0.68, 0.78],
};

const FALLBACK_DATES: Record<string, string[]> = {
  "1M": ["2026-02-16", "2026-02-23", "2026-03-02", "2026-03-09", "2026-03-16"],
  "6M": ["2025-09-16", "2025-10-16", "2025-11-16", "2025-12-16", "2026-01-16", "2026-02-16", "2026-03-16"],
  "1Y": ["2025-03-16", "2025-05-16", "2025-07-16", "2025-09-16", "2025-12-16", "2026-02-16", "2026-03-16"],
  "5Y": ["2021-03-16", "2022-03-16", "2023-03-16", "2024-03-16", "2025-03-16", "2026-03-16"],
};

const TIME_RANGES = ["1M", "6M", "1Y", "5Y"] as const;

/* ─── Helpers ───────────────────────────────────────────────── */

function fmt(n: number, decimals = 2): string {
  return n.toFixed(decimals);
}

/** Left padding for Y-axis labels */
const CHART_PAD_LEFT = 60;
const CHART_PAD_RIGHT = 16;
const CHART_PAD_TOP = 16;
const CHART_PAD_BOTTOM = 32;

function buildPolyline(
  data: number[],
  w: number,
  h: number,
  min: number,
  max: number,
): string {
  const plotW = w - CHART_PAD_LEFT - CHART_PAD_RIGHT;
  const plotH = h - CHART_PAD_TOP - CHART_PAD_BOTTOM;
  const xStep = plotW / (data.length - 1);
  const range = max - min || 1;
  return data
    .map((v, i) => {
      const norm = (v - min) / range;
      return `${CHART_PAD_LEFT + i * xStep},${CHART_PAD_TOP + plotH - norm * plotH}`;
    })
    .join(" ");
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

function formatDateLabel(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
  } catch {
    return dateStr;
  }
}

function percentChange(data: number[]): number {
  if (data.length < 2) return 0;
  const first = data[0];
  const last = data[data.length - 1];
  if (first === 0) return 0;
  return ((last - first) / first) * 100;
}

/* ─── Components ───────────────────────────────────────────── */

/* WhatsApp SVG icon (shared across CTAs) */
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* Change arrow */
function ChangeIndicator({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 font-body text-sm ${
        positive ? "text-green-400" : "text-red-400"
      }`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        className={positive ? "" : "rotate-180"}
      >
        <path d="M6 2L10 8H2L6 2Z" fill="currentColor" />
      </svg>
      {positive ? "+" : ""}
      {fmt(value)}%
    </span>
  );
}

/* ─── Page Component ────────────────────────────────────────── */

export default function GoldAndSilver() {
  useSEO({
    title: "Gold & Silver Prices | The Jewellery Studio",
    description: "Gold and silver spot prices, instant valuation calculator, and price history charts. Check precious metal values and get a valuation from Michael.",
    url: "/gold-and-silver",
  });

  const { data: prices, loading } = usePrices();

  // Derive spot and FX from live data
  const SPOT = { gold: prices.gold.gbpPerGram, silver: prices.silver.gbpPerGram };
  const FX = {
    eur: prices.gold.eurPerGram / prices.gold.gbpPerGram || 1.1624,
    usd: prices.gold.usdPerGram / prices.gold.gbpPerGram || 1.2603,
  };

  const [timeRange, setTimeRange] = useState<(typeof TIME_RANGES)[number]>("1Y");
  const [metal, setMetal] = useState<"gold" | "silver">("gold");
  const [purityIdx, setPurityIdx] = useState(0);
  const [weight, setWeight] = useState("");

  /* ─── Historical price data state ─── */
  const [historyData, setHistoryData] = useState<Record<string, HistoryData>>({});
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = useCallback(async (range: string) => {
    // Already cached
    if (historyData[range] && !historyData[range].fallback) return;

    setHistoryLoading(true);
    try {
      const res = await fetch(`/api/history?range=${range}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: HistoryData = await res.json();
      setHistoryData((prev) => ({ ...prev, [range]: data }));
    } catch (err) {
      console.warn("Failed to fetch history, using fallback:", err);
      // Use local fallback
      setHistoryData((prev) => ({
        ...prev,
        [range]: {
          gold: FALLBACK_GOLD[range] || FALLBACK_GOLD["1Y"],
          silver: FALLBACK_SILVER[range] || FALLBACK_SILVER["1Y"],
          dates: FALLBACK_DATES[range] || FALLBACK_DATES["1Y"],
          range,
          fallback: true,
        },
      }));
    } finally {
      setHistoryLoading(false);
    }
  }, [historyData]);

  // Fetch history when timeRange changes
  useEffect(() => {
    fetchHistory(timeRange);
  }, [timeRange, fetchHistory]);

  /* Reset purity selection when metal changes */
  const handleMetalChange = (m: "gold" | "silver") => {
    setMetal(m);
    setPurityIdx(0);
  };

  /* Calculator logic */
  const calcResult = useMemo(() => {
    const grams = parseFloat(weight);
    if (!grams || grams <= 0) return null;

    const spot = metal === "gold" ? SPOT.gold : SPOT.silver;
    const purity = PURITY[metal][purityIdx].factor;
    const gbp = spot * purity * grams;

    return {
      gbp,
      eur: gbp * FX.eur,
      usd: gbp * FX.usd,
      purityLabel: PURITY[metal][purityIdx].label,
    };
  }, [metal, purityIdx, weight, SPOT.gold, SPOT.silver, FX.eur, FX.usd]);

  /* WhatsApp message builder */
  const whatsappUrl = useMemo(() => {
    const purityLabel = PURITY[metal][purityIdx].label;
    const metalName = metal === "gold" ? "Gold" : "Silver";
    const grams = weight || "unknown";
    const value = calcResult ? `\u00A3${fmt(calcResult.gbp)}` : "not yet calculated";
    const msg = `Hi Michael, I have ${grams}g of ${purityLabel} ${metalName} and the calculator estimated ${value}. Could I get a full valuation please?`;
    return `https://wa.me/35054013690?text=${encodeURIComponent(msg)}`;
  }, [metal, purityIdx, weight, calcResult]);

  /* SVG chart dimensions */
  const chartW = 800;
  const chartH = 300;

  /* Get chart data for current time range */
  const currentHistory = historyData[timeRange];
  const activeGold = currentHistory?.gold || FALLBACK_GOLD[timeRange];
  const activeSilver = currentHistory?.silver || FALLBACK_SILVER[timeRange];
  const activeDates = currentHistory?.dates || FALLBACK_DATES[timeRange];

  /* Compute Y-axis bounds with 5% padding */
  const allValues = [...activeGold, ...activeSilver];
  const dataMin = Math.min(...allValues);
  const dataMax = Math.max(...allValues);
  const yPadding = (dataMax - dataMin) * 0.05 || 0.01;
  const yMin = dataMin - yPadding;
  const yMax = dataMax + yPadding;

  /* Compute Y-axis tick values (5 evenly spaced) */
  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const step = (yMax - yMin) / 4;
    for (let i = 0; i <= 4; i++) {
      ticks.push(yMin + step * i);
    }
    return ticks;
  }, [yMin, yMax]);

  /* Compute X-axis date labels (spread evenly, max 5) */
  const xLabels = useMemo(() => {
    if (!activeDates || activeDates.length === 0) return [];
    const count = Math.min(5, activeDates.length);
    const labels: { date: string; x: number }[] = [];
    const plotW = chartW - CHART_PAD_LEFT - CHART_PAD_RIGHT;
    for (let i = 0; i < count; i++) {
      const idx = Math.round((i / (count - 1)) * (activeDates.length - 1));
      labels.push({
        date: formatDateLabel(activeDates[idx]),
        x: CHART_PAD_LEFT + (idx / (activeDates.length - 1)) * plotW,
      });
    }
    return labels;
  }, [activeDates, chartW]);

  /* Calculate real percentage change from historical data */
  const goldChange = useMemo(() => percentChange(activeGold), [activeGold]);
  const silverChange = useMemo(() => percentChange(activeSilver), [activeSilver]);

  const lastUpdated = formatTimestamp(prices.timestamp);

  return (
    <div className="bg-navy min-h-screen pt-32">
      {/* ── Header ── */}
      <div className="text-center px-4 mb-16">
        <SectionReveal>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            PRECIOUS METAL PRICES
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-warm">
            Gold &amp; Silver
          </h1>
          <GoldDivider className="mt-4" />
          {loading && (
            <p className="font-body text-xs text-gold/50 mt-2 animate-pulse">
              Fetching live prices...
            </p>
          )}
          {prices.fallback && !loading && (
            <p className="font-body text-xs text-warm/40 mt-2">
              Showing indicative prices
            </p>
          )}
        </SectionReveal>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 1 — Live Price Dashboard
          ══════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gold Card */}
          <SectionReveal variant="fade-left">
            <div className="bg-navy-card rounded-lg border border-gold/30 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-3xl text-gold">Gold</h2>
                <ChangeIndicator value={goldChange} />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-body text-sm text-muted">GBP</span>
                  <span className="font-display text-2xl text-warm">
                    £{fmt(prices.gold.gbpPerGram)}
                    <span className="text-sm text-muted font-body ml-1">/g</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-body text-sm text-muted">EUR</span>
                  <span className="font-display text-2xl text-warm">
                    €{fmt(prices.gold.eurPerGram)}
                    <span className="text-sm text-muted font-body ml-1">/g</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-body text-sm text-muted">USD</span>
                  <span className="font-display text-2xl text-warm">
                    ${fmt(prices.gold.usdPerGram)}
                    <span className="text-sm text-muted font-body ml-1">/g</span>
                  </span>
                </div>
              </div>

              <p className="font-body text-xs text-dim">
                Last updated: {lastUpdated}
              </p>
            </div>
          </SectionReveal>

          {/* Silver Card */}
          <SectionReveal variant="fade-right">
            <div className="bg-navy-card rounded-lg border border-[#9CA3AF]/30 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-3xl text-[#C0C0C0]">Silver</h2>
                <ChangeIndicator value={silverChange} />
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-baseline justify-between">
                  <span className="font-body text-sm text-muted">GBP</span>
                  <span className="font-display text-2xl text-warm">
                    £{fmt(prices.silver.gbpPerGram)}
                    <span className="text-sm text-muted font-body ml-1">/g</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-body text-sm text-muted">EUR</span>
                  <span className="font-display text-2xl text-warm">
                    €{fmt(prices.silver.eurPerGram)}
                    <span className="text-sm text-muted font-body ml-1">/g</span>
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-body text-sm text-muted">USD</span>
                  <span className="font-display text-2xl text-warm">
                    ${fmt(prices.silver.usdPerGram)}
                    <span className="text-sm text-muted font-body ml-1">/g</span>
                  </span>
                </div>
              </div>

              <p className="font-body text-xs text-dim">
                Last updated: {lastUpdated}
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2 — Price History Chart
          ══════════════════════════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mb-24">
        <SectionReveal>
          <div className="text-center mb-8">
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
              PRICE HISTORY
            </p>
            <h2 className="font-display text-3xl md:text-[42px] text-warm">
              Market Trends
            </h2>
            <GoldDivider className="mt-4" />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="bg-navy-card rounded-lg border border-gold/20 p-6 sm:p-8">
            {/* Time range toggles */}
            <div className="flex items-center gap-2 mb-6">
              {TIME_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`font-body text-xs uppercase tracking-elegant px-4 py-2 rounded transition-colors duration-200 ${
                    timeRange === range
                      ? "bg-gold text-navy-darkest"
                      : "bg-navy text-muted hover:text-warm"
                  }`}
                >
                  {range}
                </button>
              ))}
              {historyLoading && (
                <span className="font-body text-xs text-gold/50 ml-2 animate-pulse">
                  Loading...
                </span>
              )}
            </div>

            {/* SVG Chart */}
            <div className="w-full overflow-hidden">
              <svg
                viewBox={`0 0 ${chartW} ${chartH}`}
                className="w-full h-auto"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Y-axis labels */}
                {yTicks.map((tick, i) => {
                  const plotH = chartH - CHART_PAD_TOP - CHART_PAD_BOTTOM;
                  const norm = (tick - yMin) / (yMax - yMin || 1);
                  const y = CHART_PAD_TOP + plotH - norm * plotH;
                  return (
                    <g key={`ytick-${i}`}>
                      <text
                        x={CHART_PAD_LEFT - 8}
                        y={y + 4}
                        textAnchor="end"
                        className="fill-current text-muted"
                        style={{ fontSize: 11, fontFamily: 'system-ui, sans-serif' }}
                        fill="#9CA3AF"
                      >
                        £{tick < 1 ? tick.toFixed(2) : tick.toFixed(0)}
                      </text>
                      <line
                        x1={CHART_PAD_LEFT}
                        y1={y}
                        x2={chartW - CHART_PAD_RIGHT}
                        y2={y}
                        stroke="#4A5A6A"
                        strokeWidth={0.5}
                        strokeDasharray="4 4"
                        opacity={0.4}
                      />
                    </g>
                  );
                })}

                {/* X-axis date labels */}
                {xLabels.map((label, i) => (
                  <text
                    key={`xlabel-${i}`}
                    x={label.x}
                    y={chartH - 4}
                    textAnchor="middle"
                    fill="#9CA3AF"
                    style={{ fontSize: 10, fontFamily: 'system-ui, sans-serif' }}
                  >
                    {label.date}
                  </text>
                ))}

                {/* Silver area fill */}
                <polygon
                  points={`${buildPolyline(activeSilver, chartW, chartH, yMin, yMax)} ${chartW - CHART_PAD_RIGHT},${CHART_PAD_TOP + chartH - CHART_PAD_TOP - CHART_PAD_BOTTOM} ${CHART_PAD_LEFT},${CHART_PAD_TOP + chartH - CHART_PAD_TOP - CHART_PAD_BOTTOM}`}
                  fill="url(#silverGrad)"
                  opacity={0.15}
                />

                {/* Gold area fill */}
                <polygon
                  points={`${buildPolyline(activeGold, chartW, chartH, yMin, yMax)} ${chartW - CHART_PAD_RIGHT},${CHART_PAD_TOP + chartH - CHART_PAD_TOP - CHART_PAD_BOTTOM} ${CHART_PAD_LEFT},${CHART_PAD_TOP + chartH - CHART_PAD_TOP - CHART_PAD_BOTTOM}`}
                  fill="url(#goldGrad)"
                  opacity={0.15}
                />

                {/* Silver line */}
                <polyline
                  points={buildPolyline(activeSilver, chartW, chartH, yMin, yMax)}
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Gold line */}
                <polyline
                  points={buildPolyline(activeGold, chartW, chartH, yMin, yMax)}
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="silverGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9CA3AF" />
                    <stop offset="100%" stopColor="#9CA3AF" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-gold inline-block rounded" />
                <span className="font-body text-xs text-muted">Gold (GBP/g)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#9CA3AF] inline-block rounded" />
                <span className="font-body text-xs text-muted">Silver (GBP/g)</span>
              </div>
              {currentHistory?.fallback && (
                <span className="font-body text-xs text-warm/30 ml-auto">
                  Indicative data
                </span>
              )}
            </div>

            {/* Insight text */}
            <p className="font-body text-sm text-warm/70 mt-6">
              Gold and silver prices fluctuate daily based on global market
              conditions. Check back regularly for the latest indicative pricing.
            </p>
          </div>
        </SectionReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3 — Instant Valuation Calculator
          ══════════════════════════════════════════════════════════ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 mb-24">
        <SectionReveal>
          <div className="text-center mb-10">
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
              INSTANT CALCULATOR
            </p>
            <h2 className="font-display text-3xl md:text-[42px] text-warm">
              What Is Your Gold or Silver Worth?
            </h2>
            <GoldDivider className="mt-4" />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="bg-navy-card rounded-lg border border-gold/20 p-6 sm:p-10">
            {/* Metal selector */}
            <div className="flex gap-0 rounded-full overflow-hidden border border-gold/30 w-fit mx-auto mb-8">
              {(["gold", "silver"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => handleMetalChange(m)}
                  className={`font-body text-xs uppercase tracking-elegant px-8 py-3 transition-colors duration-200 ${
                    metal === m
                      ? "bg-gold text-navy-darkest"
                      : "bg-transparent text-muted hover:text-warm"
                  }`}
                >
                  {m === "gold" ? "Gold" : "Silver"}
                </button>
              ))}
            </div>

            {/* Purity selector */}
            <div className="mb-8">
              <label className="block font-body text-xs uppercase tracking-elegant text-muted mb-3 text-center">
                {metal === "gold" ? "Carat" : "Purity"}
              </label>
              <div className="flex gap-2 justify-center flex-wrap">
                {PURITY[metal].map((p, i) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setPurityIdx(i)}
                    className={`font-body text-sm px-5 py-2.5 rounded border transition-colors duration-200 ${
                      purityIdx === i
                        ? "bg-gold text-navy-darkest border-gold"
                        : "bg-navy border-gold/30 text-muted hover:text-warm hover:border-gold/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight input */}
            <div className="mb-10">
              <label className="block font-body text-xs uppercase tracking-elegant text-muted mb-3 text-center">
                Weight in grams
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="0.00"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="block mx-auto w-full max-w-xs bg-navy border border-gold/30 rounded-lg px-6 py-4 text-center font-display text-3xl text-warm placeholder:text-dim focus:outline-none focus:border-gold transition-colors duration-200"
              />
            </div>

            {/* Result */}
            <motion.div
              className="text-center"
              initial={false}
              animate={{ opacity: calcResult ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            >
              {calcResult ? (
                <>
                  <p className="font-body text-xs uppercase tracking-elegant text-muted mb-2">
                    Estimated melt value
                  </p>
                  <p className="font-display text-5xl md:text-6xl text-gold mb-2">
                    £{fmt(calcResult.gbp)}
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="font-body text-sm text-muted">
                      €{fmt(calcResult.eur)}
                    </span>
                    <span className="text-dim">|</span>
                    <span className="font-body text-sm text-muted">
                      ${fmt(calcResult.usd)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-body text-xs uppercase tracking-elegant text-muted mb-2">
                    Estimated melt value
                  </p>
                  <p className="font-display text-5xl md:text-6xl text-dim mb-2">
                    £0.00
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="font-body text-sm text-dim">€0.00</span>
                    <span className="text-dim">|</span>
                    <span className="font-body text-sm text-dim">$0.00</span>
                  </div>
                </>
              )}
            </motion.div>

            {/* Explanation */}
            <p className="font-body text-xs text-warm/50 text-center leading-relaxed max-w-md mx-auto mb-8">
              This is the melt value based on the current spot price. The actual
              price Michael offers may differ depending on the piece, its
              condition, and any additional value beyond the raw metal content.
            </p>

            {/* CTA */}
            <div className="text-center">
              <MagneticButton
                href={whatsappUrl}
                className="bg-gold text-navy-darkest px-8 py-3.5 hover:bg-gold-muted font-body text-[11px] uppercase tracking-elegant inline-flex items-center gap-2"
              >
                <WhatsAppIcon />
                GET A FULL VALUATION FROM MICHAEL
              </MagneticButton>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ══════════════════════════════════════════════════════════
          Bottom CTA — Why Sell in Gibraltar
          ══════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <SectionReveal>
          <div className="text-center mb-10">
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
              WHY SELL WITH US
            </p>
            <h2 className="font-display text-3xl md:text-[42px] text-warm">
              The Gibraltar Advantage
            </h2>
            <GoldDivider className="mt-4" />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Tax-Free Territory",
                text: "Gibraltar has no VAT, no capital gains tax, and no sales tax on precious metals. What Michael offers you is what you walk away with.",
              },
              {
                title: "38 Years of Expertise",
                text: "Michael has been buying, selling, and valuing precious metals for almost four decades. You're dealing with someone who knows exactly what your items are worth.",
              },
              {
                title: "Immediate Payment",
                text: "No waiting for bank transfers or cheques to clear. Agree on a price, get paid on the spot. Cash or bank transfer, your choice.",
              },
            ].map((item, i) => (
              <SectionReveal key={i} delay={i * 0.08}>
                <div className="bg-navy-card rounded-lg border border-gold/15 p-6 h-full">
                  <h3 className="font-display text-xl text-gold mb-3">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-warm/60 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="text-center">
            <p className="font-body text-sm text-warm/60 mb-6 max-w-lg mx-auto">
              Whether you're selling a single ring or clearing out an entire
              collection, Michael will give you an honest price with zero
              pressure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton
                href="https://wa.me/35054013690?text=Hi%20Michael%2C%20I'd%20like%20to%20get%20a%20valuation%20on%20some%20gold%2Fsilver%20items."
                className="bg-gold text-navy-darkest px-8 py-3.5 hover:bg-gold-muted font-body text-[11px] uppercase tracking-elegant inline-flex items-center gap-2"
              >
                <WhatsAppIcon />
                MESSAGE MICHAEL ON WHATSAPP
              </MagneticButton>
              <MagneticButton
                href="/contact"
                className="border border-gold text-gold px-8 py-3.5 hover:bg-gold hover:text-navy-darkest font-body text-[11px] uppercase tracking-elegant"
              >
                CONTACT US
              </MagneticButton>
            </div>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { PriceData, PricesState } from "../lib/priceTypes";

// Fallback values matching the old hardcoded data so nothing breaks if API is down
const FALLBACK_DATA: PriceData = {
  gold: { gbpPerGram: 68.42, eurPerGram: 79.53, usdPerGram: 86.21, usdPerOz: 2681 },
  silver: { gbpPerGram: 0.78, eurPerGram: 0.91, usdPerGram: 0.98, usdPerOz: 30.5 },
  fx: { gbpUsd: 0.79, eurUsd: 0.92 },
  timestamp: new Date().toISOString(),
  fallback: true,
};

const PricesContext = createContext<PricesState>({
  data: FALLBACK_DATA,
  loading: true,
  error: null,
});

export function PricesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PricesState>({
    data: FALLBACK_DATA,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchPrices() {
      try {
        const res = await fetch("/api/prices");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: PriceData = await res.json();
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (err) {
        if (!cancelled) {
          console.warn("Failed to fetch live prices, using fallback:", err);
          setState((prev) => ({
            ...prev,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to fetch prices",
          }));
        }
      }
    }

    fetchPrices();

    // Refresh every 30 minutes while tab is open
    const interval = setInterval(fetchPrices, 30 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <PricesContext.Provider value={state}>{children}</PricesContext.Provider>
  );
}

/** Hook to access live metal prices. Safe to call from any component. */
export function usePrices(): PricesState {
  return useContext(PricesContext);
}

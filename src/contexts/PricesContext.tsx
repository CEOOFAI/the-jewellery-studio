import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { PriceData, PricesState } from "../lib/priceTypes";

// Fallback values (updated 2026-03-16 from gold-api.com) so nothing breaks if API is down
const FALLBACK_DATA: PriceData = {
  gold: { gbpPerGram: 121.30, eurPerGram: 140.43, usdPerGram: 160.90, usdPerOz: 5004.5 },
  silver: { gbpPerGram: 1.94, eurPerGram: 2.25, usdPerGram: 2.57, usdPerOz: 80.08 },
  fx: { gbpUsd: 0.754, eurUsd: 0.873 },
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

/** Shape returned by /api/prices */
export interface MetalPrice {
  gbpPerGram: number;
  eurPerGram: number;
  usdPerGram: number;
  usdPerOz: number;
}

export interface PriceData {
  gold: MetalPrice;
  silver: MetalPrice;
  fx: {
    gbpUsd: number;
    eurUsd: number;
  };
  timestamp: string;
  fallback?: boolean;
}

export interface PricesState {
  data: PriceData;
  loading: boolean;
  error: string | null;
}

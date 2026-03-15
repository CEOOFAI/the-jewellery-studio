// Shared constants - single source of truth for rates, labels, etc.

// Mock exchange rates (will be replaced with live data from v2_exchange_rates)
export const EUR_RATE = 1.1624;
export const USD_RATE = 1.2603;

// Mock spot prices per gram (will be replaced with live data from v2_metal_prices)
export const SPOT_PRICES = {
  gold: 68.42,
  silver: 0.78,
} as const;

// Category labels used across ProductCard, ProductDetail, etc.
export const CATEGORY_LABELS: Record<string, string> = {
  watches: "Watches",
  engagement: "Engagement",
  gold: "Gold",
  necklaces: "Necklaces",
  diamonds: "Diamonds",
  preowned: "Pre-Owned",
};

// WhatsApp number
export const WHATSAPP_NUMBER = "35054013690";

// Phone number validation (basic international format)
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return /^\+?\d{7,15}$/.test(cleaned);
}

// Shared constants - single source of truth for rates, labels, etc.

// Fallback exchange rates used by ProductCard / ProductDetail.
// Live metal prices come from /api/prices via PricesContext (gold ticker, spot cards, calculator).
export const EUR_RATE = 1.1624;
export const USD_RATE = 1.2603;

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

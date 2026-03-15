import type { VercelRequest, VercelResponse } from '@vercel/node';

const TROY_OZ_TO_GRAM = 31.1035;

// Fallback prices (updated 2026-03-16 from gold-api.com)
const FALLBACK = {
  gold: { gbpPerGram: 121.30, eurPerGram: 140.43, usdPerGram: 160.90, usdPerOz: 5004.5 },
  silver: { gbpPerGram: 1.94, eurPerGram: 2.25, usdPerGram: 2.57, usdPerOz: 80.08 },
  fx: { gbpUsd: 0.754, eurUsd: 0.873 },
  timestamp: new Date().toISOString(),
  fallback: true,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cache for 30 minutes, serve stale for up to 1 hour
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Fetch gold, silver, and FX rates in parallel
    // Using gold-api.com (free, no key needed) instead of metals.live (blocks Vercel)
    const [goldRes, silverRes, fxRes] = await Promise.all([
      fetch('https://api.gold-api.com/price/XAU', {
        headers: { 'User-Agent': 'TheJewelleryStudio/1.0' },
        signal: AbortSignal.timeout(8000),
      }),
      fetch('https://api.gold-api.com/price/XAG', {
        headers: { 'User-Agent': 'TheJewelleryStudio/1.0' },
        signal: AbortSignal.timeout(8000),
      }),
      fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        headers: { 'User-Agent': 'TheJewelleryStudio/1.0' },
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    if (!goldRes.ok || !silverRes.ok || !fxRes.ok) {
      console.error(`API status: gold=${goldRes.status}, silver=${silverRes.status}, fx=${fxRes.status}`);
      throw new Error('API request failed');
    }

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();
    const fxData = await fxRes.json();

    // gold-api.com returns { name: "Gold", price: 5004.5, symbol: "XAU", ... }
    // Price is in USD per troy ounce
    const goldUsdOz = goldData.price;
    const silverUsdOz = silverData.price;

    if (!goldUsdOz || !silverUsdOz) {
      console.error('Missing prices:', { goldData, silverData });
      throw new Error('Missing gold or silver price');
    }

    const gbpRate = fxData.rates?.GBP;
    const eurRate = fxData.rates?.EUR;

    if (!gbpRate || !eurRate) {
      throw new Error('Missing FX rates');
    }

    // Convert USD per troy ounce to per-gram prices in each currency
    const goldGbpGram = (goldUsdOz * gbpRate) / TROY_OZ_TO_GRAM;
    const silverGbpGram = (silverUsdOz * gbpRate) / TROY_OZ_TO_GRAM;
    const goldEurGram = (goldUsdOz * eurRate) / TROY_OZ_TO_GRAM;
    const silverEurGram = (silverUsdOz * eurRate) / TROY_OZ_TO_GRAM;
    const goldUsdGram = goldUsdOz / TROY_OZ_TO_GRAM;
    const silverUsdGram = silverUsdOz / TROY_OZ_TO_GRAM;

    return res.status(200).json({
      gold: {
        gbpPerGram: Number(goldGbpGram.toFixed(2)),
        eurPerGram: Number(goldEurGram.toFixed(2)),
        usdPerGram: Number(goldUsdGram.toFixed(2)),
        usdPerOz: goldUsdOz,
      },
      silver: {
        gbpPerGram: Number(silverGbpGram.toFixed(2)),
        eurPerGram: Number(silverEurGram.toFixed(2)),
        usdPerGram: Number(silverUsdGram.toFixed(2)),
        usdPerOz: silverUsdOz,
      },
      fx: {
        gbpUsd: gbpRate,
        eurUsd: eurRate,
      },
      timestamp: new Date().toISOString(),
      fallback: false,
    });
  } catch (error) {
    console.error('Price API error:', error instanceof Error ? error.message : error);
    return res.status(200).json(FALLBACK);
  }
}

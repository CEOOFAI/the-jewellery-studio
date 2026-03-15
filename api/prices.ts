import type { VercelRequest, VercelResponse } from '@vercel/node';

const TROY_OZ_TO_GRAM = 31.1035;

// Fallback prices (updated periodically as a safety net)
const FALLBACK = {
  gold: { gbpPerGram: 68.42, eurPerGram: 79.53, usdPerGram: 86.21, usdPerOz: 2681 },
  silver: { gbpPerGram: 0.78, eurPerGram: 0.91, usdPerGram: 0.98, usdPerOz: 30.5 },
  fx: { gbpUsd: 0.79, eurUsd: 0.92 },
  timestamp: new Date().toISOString(),
  fallback: true,
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Cache for 30 minutes, serve stale for up to 1 hour
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    // Fetch metal prices and FX rates in parallel
    const [metalsRes, fxRes] = await Promise.all([
      fetch('https://api.metals.live/v1/spot', { signal: AbortSignal.timeout(8000) }),
      fetch('https://api.exchangerate-api.com/v4/latest/USD', { signal: AbortSignal.timeout(8000) }),
    ]);

    if (!metalsRes.ok || !fxRes.ok) {
      throw new Error(`API error: metals=${metalsRes.status}, fx=${fxRes.status}`);
    }

    const metalsData = await metalsRes.json();
    const fxData = await fxRes.json();

    // metals.live returns an array of objects, each with a metal name and price
    // Format: [{ gold: 2950.50, silver: 33.20, platinum: ..., palladium: ... }]
    // OR it could be [{gold: ...}] depending on version
    let goldUsdOz: number;
    let silverUsdOz: number;

    if (Array.isArray(metalsData)) {
      // Could be [{gold: x, silver: y}] or separate objects
      const first = metalsData[0];
      if (first && typeof first.gold === 'number') {
        goldUsdOz = first.gold;
        silverUsdOz = first.silver;
      } else {
        // Try to find gold and silver in separate array entries
        const goldEntry = metalsData.find((d: Record<string, unknown>) => 'gold' in d);
        const silverEntry = metalsData.find((d: Record<string, unknown>) => 'silver' in d);
        goldUsdOz = goldEntry?.gold as number;
        silverUsdOz = silverEntry?.silver as number;
      }
    } else if (metalsData && typeof metalsData.gold === 'number') {
      goldUsdOz = metalsData.gold;
      silverUsdOz = metalsData.silver;
    } else {
      throw new Error('Unexpected metals API response format');
    }

    if (!goldUsdOz || !silverUsdOz) {
      throw new Error('Missing gold or silver price from API');
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
    console.error('Price API error:', error);
    // Return fallback prices so the site never breaks
    return res.status(200).json(FALLBACK);
  }
}

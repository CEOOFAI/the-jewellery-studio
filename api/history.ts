import type { VercelRequest, VercelResponse } from '@vercel/node';

const TROY_OZ_TO_GRAM = 31.1035;

/* ─── Fallback static data (GBP per gram, approximate) ─── */
const FALLBACK_GOLD: Record<string, number[]> = {
  '1M': [72.50, 73.10, 71.80, 73.50, 74.20],
  '6M': [62.30, 64.50, 65.80, 67.20, 69.40, 72.50, 74.20],
  '1Y': [55.80, 58.40, 60.20, 62.30, 67.20, 72.50, 74.20],
  '5Y': [42.50, 44.80, 49.20, 55.80, 62.30, 74.20],
};

const FALLBACK_SILVER: Record<string, number[]> = {
  '1M': [0.74, 0.76, 0.75, 0.77, 0.78],
  '6M': [0.68, 0.70, 0.71, 0.73, 0.74, 0.76, 0.78],
  '1Y': [0.62, 0.64, 0.66, 0.68, 0.73, 0.76, 0.78],
  '5Y': [0.52, 0.55, 0.58, 0.62, 0.68, 0.78],
};

const FALLBACK_DATES: Record<string, string[]> = {
  '1M': ['2026-02-16', '2026-02-23', '2026-03-02', '2026-03-09', '2026-03-16'],
  '6M': ['2025-09-16', '2025-10-16', '2025-11-16', '2025-12-16', '2026-01-16', '2026-02-16', '2026-03-16'],
  '1Y': ['2025-03-16', '2025-05-16', '2025-07-16', '2025-09-16', '2025-12-16', '2026-02-16', '2026-03-16'],
  '5Y': ['2021-03-16', '2022-03-16', '2023-03-16', '2024-03-16', '2025-03-16', '2026-03-16'],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const range = (req.query.range as string) || '1Y';

  // Cache historical data for 24 hours (it doesn't change retroactively)
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=172800');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Map our ranges to Yahoo Finance ranges and intervals
  const rangeMap: Record<string, { range: string; interval: string }> = {
    '1M': { range: '1mo', interval: '1d' },
    '6M': { range: '6mo', interval: '1wk' },
    '1Y': { range: '1y', interval: '1wk' },
    '5Y': { range: '5y', interval: '1mo' },
  };

  const config = rangeMap[range] || rangeMap['1Y'];

  try {
    // Fetch gold futures, silver futures, and GBP/USD rate in parallel
    const [goldRes, silverRes, fxRes] = await Promise.all([
      fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=${config.interval}&range=${config.range}`,
        { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, signal: AbortSignal.timeout(10000) },
      ),
      fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/SI=F?interval=${config.interval}&range=${config.range}`,
        { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, signal: AbortSignal.timeout(10000) },
      ),
      fetch('https://api.exchangerate-api.com/v4/latest/USD', { signal: AbortSignal.timeout(8000) }),
    ]);

    if (!goldRes.ok || !silverRes.ok || !fxRes.ok) {
      throw new Error(`API error: gold=${goldRes.status}, silver=${silverRes.status}, fx=${fxRes.status}`);
    }

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();
    const fxData = await fxRes.json();

    const gbpRate = fxData.rates?.GBP || 0.79;

    // Extract closing prices from Yahoo Finance response
    const goldResult = goldData.chart?.result?.[0];
    const silverResult = silverData.chart?.result?.[0];

    if (!goldResult || !silverResult) {
      throw new Error('No chart data in Yahoo Finance response');
    }

    const goldPrices: (number | null)[] = goldResult.indicators?.quote?.[0]?.close || [];
    const silverPrices: (number | null)[] = silverResult.indicators?.quote?.[0]?.close || [];
    const goldTimestamps: number[] = goldResult.timestamp || [];
    const silverTimestamps: number[] = silverResult.timestamp || [];

    // Build a date-indexed map for silver so we can align with gold dates
    const silverByDate = new Map<string, number>();
    for (let i = 0; i < silverTimestamps.length; i++) {
      if (silverPrices[i] != null) {
        const date = new Date(silverTimestamps[i] * 1000).toISOString().split('T')[0];
        silverByDate.set(date, silverPrices[i] as number);
      }
    }

    // Convert USD/oz to GBP/gram, align gold and silver by date
    const gold: number[] = [];
    const silver: number[] = [];
    const dates: string[] = [];

    for (let i = 0; i < goldPrices.length; i++) {
      if (goldPrices[i] == null) continue;
      const date = new Date(goldTimestamps[i] * 1000).toISOString().split('T')[0];
      const silverPrice = silverByDate.get(date);
      if (silverPrice == null) continue;

      gold.push(Number(((goldPrices[i] as number) * gbpRate / TROY_OZ_TO_GRAM).toFixed(2)));
      silver.push(Number((silverPrice * gbpRate / TROY_OZ_TO_GRAM).toFixed(2)));
      dates.push(date);
    }

    if (gold.length === 0) throw new Error('No aligned price data after processing');

    return res.status(200).json({ gold, silver, dates, range, fallback: false });
  } catch (error) {
    console.error('History API error:', error);

    // Return fallback static data so the chart always renders
    const validRange = range in FALLBACK_GOLD ? range : '1Y';
    return res.status(200).json({
      gold: FALLBACK_GOLD[validRange],
      silver: FALLBACK_SILVER[validRange],
      dates: FALLBACK_DATES[validRange],
      range: validRange,
      fallback: true,
    });
  }
}

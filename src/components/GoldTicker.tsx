import { usePrices } from "../contexts/PricesContext";

function TickerBlock({ gold, silver }: {
  gold: { gbp: string; eur: string; usd: string };
  silver: { gbp: string; eur: string; usd: string };
}) {
  return (
    <span className="inline-flex items-center shrink-0">
      <span className="inline-flex items-center gap-2 px-6">
        <span className="text-gold font-semibold">GOLD</span>
        <span className="text-muted">&pound;{gold.gbp}/g</span>
        <span className="text-dim">&bull;</span>
        <span className="text-muted">&euro;{gold.eur}/g</span>
        <span className="text-dim">&bull;</span>
        <span className="text-muted">${gold.usd}/g</span>
      </span>
      <span className="inline-flex items-center gap-2 px-6">
        <span className="text-[#9BA8B5] font-semibold">SILVER</span>
        <span className="text-muted">&pound;{silver.gbp}/g</span>
        <span className="text-dim">&bull;</span>
        <span className="text-muted">&euro;{silver.eur}/g</span>
        <span className="text-dim">&bull;</span>
        <span className="text-muted">${silver.usd}/g</span>
      </span>
    </span>
  );
}

export default function GoldTicker() {
  const { data } = usePrices();

  const gold = {
    gbp: data.gold.gbpPerGram.toFixed(2),
    eur: data.gold.eurPerGram.toFixed(2),
    usd: data.gold.usdPerGram.toFixed(2),
  };
  const silver = {
    gbp: data.silver.gbpPerGram.toFixed(2),
    eur: data.silver.eurPerGram.toFixed(2),
    usd: data.silver.usdPerGram.toFixed(2),
  };

  return (
    <div
      className="bg-navy-deep overflow-hidden font-body"
      style={{
        height: 30,
        borderTop: "1px solid rgba(201, 168, 76, 0.15)",
      }}
    >
      <div className="ticker-track flex items-center h-full whitespace-nowrap">
        <TickerBlock gold={gold} silver={silver} />
        <TickerBlock gold={gold} silver={silver} />
        <TickerBlock gold={gold} silver={silver} />
        <TickerBlock gold={gold} silver={silver} />
        <TickerBlock gold={gold} silver={silver} />
        <TickerBlock gold={gold} silver={silver} />
        <TickerBlock gold={gold} silver={silver} />
        <TickerBlock gold={gold} silver={silver} />
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          animation: ticker 40s linear infinite;
          font-size: 10px;
          letter-spacing: 0.02em;
          width: max-content;
        }
      `}</style>
    </div>
  );
}

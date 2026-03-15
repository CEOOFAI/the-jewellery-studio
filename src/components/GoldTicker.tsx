function TickerBlock() {
  return (
    <span className="inline-flex items-center shrink-0">
      <span className="inline-flex items-center gap-2 px-6">
        <span className="text-gold font-semibold">GOLD</span>
        <span className="text-muted">&pound;68.42/g</span>
        <span className="text-dim">&bull;</span>
        <span className="text-muted">&euro;79.53/g</span>
        <span className="text-dim">&bull;</span>
        <span className="text-muted">$86.21/g</span>
        <span className="text-green-400">&#9650; 0.3%</span>
      </span>
      <span className="inline-flex items-center gap-2 px-6">
        <span className="text-[#9BA8B5] font-semibold">SILVER</span>
        <span className="text-muted">&pound;0.78/g</span>
        <span className="text-dim">&bull;</span>
        <span className="text-muted">&euro;0.91/g</span>
        <span className="text-dim">&bull;</span>
        <span className="text-muted">$0.98/g</span>
        <span className="text-green-400">&#9650; 0.1%</span>
      </span>
    </span>
  );
}

export default function GoldTicker() {
  return (
    <div
      className="bg-navy-deep overflow-hidden font-body"
      style={{
        height: 30,
        borderTop: "1px solid rgba(201, 168, 76, 0.15)",
      }}
    >
      <div className="ticker-track flex items-center h-full whitespace-nowrap">
        <TickerBlock />
        <TickerBlock />
        <TickerBlock />
        <TickerBlock />
        <TickerBlock />
        <TickerBlock />
        <TickerBlock />
        <TickerBlock />
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

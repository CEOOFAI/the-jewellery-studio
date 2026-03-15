import { Link } from "react-router-dom";
import SectionReveal from "../components/SectionReveal";
import { usePrices } from "../contexts/PricesContext";

// @ts-expect-error Sparkline removed from render, kept for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Sparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg viewBox="0 0 120 40" className="w-full h-10 mt-3" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SpotPriceCards() {
  const { data } = usePrices();

  return (
    <SectionReveal>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {/* Gold card */}
        <div
          className="bg-navy-card rounded-lg p-6"
          style={{ border: "1px solid rgba(201, 168, 76, 0.25)" }}
        >
          <p className="text-gold font-body text-xs tracking-[0.15em] uppercase mb-1">
            Gold
          </p>
          <p className="font-display text-warm text-3xl font-semibold">
            &pound;{data.gold.gbpPerGram.toFixed(2)}<span className="text-lg text-muted">/g</span>
          </p>
        </div>

        {/* Silver card */}
        <div
          className="bg-navy-card rounded-lg p-6"
          style={{ border: "1px solid rgba(155, 168, 181, 0.2)" }}
        >
          <p className="text-[#9BA8B5] font-body text-xs tracking-[0.15em] uppercase mb-1">
            Silver
          </p>
          <p className="font-display text-warm text-3xl font-semibold">
            &pound;{data.silver.gbpPerGram.toFixed(2)}<span className="text-lg text-muted">/g</span>
          </p>
        </div>
      </div>

      <div className="text-center mt-5">
        <Link
          to="/gold-and-silver"
          className="text-gold/70 hover:text-gold text-sm font-body transition-colors"
        >
          See full price history &rarr;
        </Link>
      </div>
    </SectionReveal>
  );
}

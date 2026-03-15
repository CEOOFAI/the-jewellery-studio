import { Link } from "react-router-dom";
import SectionReveal from "../components/SectionReveal";
import { usePrices } from "../contexts/PricesContext";

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
          <Sparkline
            color="#C9A84C"
            points="0,30 15,28 30,25 45,27 60,22 75,20 90,18 105,15 120,12"
          />
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
          <Sparkline
            color="#9BA8B5"
            points="0,28 15,30 30,26 45,24 60,25 75,22 90,19 105,17 120,15"
          />
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

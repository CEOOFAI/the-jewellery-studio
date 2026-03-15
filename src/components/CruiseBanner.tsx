import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface CruiseShip {
  ship_name: string;
}

export default function CruiseBanner() {
  const [ships, setShips] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchShips() {
      const today = new Date().toISOString().split("T")[0];

      const { data } = await supabase
        .from("v2_cruise_schedule")
        .select("ship_name")
        .lte("arrival_date", today)
        .gte("departure_date", today);

      if (data && data.length > 0) {
        setShips((data as CruiseShip[]).map((row) => row.ship_name));
      }

      setLoaded(true);
    }

    fetchShips();
  }, []);

  if (!loaded || ships.length === 0) return null;

  return (
    <div
      className="w-full bg-navy-deep border-y border-gold/20 py-3 px-6"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        {/* Left: pulse dot + label */}
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-2 h-2 rounded-full bg-gold"
            style={{
              animation: "pulseGold 2s ease-in-out infinite",
            }}
          />
          <span className="font-body text-[11px] uppercase tracking-luxe text-gold font-semibold">
            In Port Today
          </span>
        </div>

        {/* Ship icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-gold/60 shrink-0 hidden sm:block"
        >
          <path d="M2 20l1.5-1.5C5 17 7 17 8.5 18.5 10 17 12 17 13.5 18.5 15 17 17 17 18.5 18.5 20 17 22 17 22 17l-1-3H3l-1 3z" />
          <path d="M4 17V11h4V7h8v4h4v6" />
          <path d="M12 7V3" />
          <path d="M10 3h4" />
        </svg>

        {/* Right: ship names */}
        <span className="font-body text-[11px] uppercase tracking-luxe text-warm">
          {ships.join(" \u00B7 ")}
        </span>
      </div>

      <style>{`
        @keyframes pulseGold {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

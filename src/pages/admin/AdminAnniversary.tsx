import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface AnniversaryEntry {
  id: string;
  name: string;
  whatsapp: string;
  occasion: string;
  date: string;
  budget: string;
  created_at: string;
}

export default function AdminAnniversary() {
  const [entries, setEntries] = useState<AnniversaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    setLoading(true);
    const { data, error } = await supabase
      .from("v2_anniversary_vault")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Failed to fetch anniversary entries:", error);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  }

  function isWithin30Days(dateStr: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - today.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 30;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function daysUntil(dateStr: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  const upcomingCount = entries.filter((e) => isWithin30Days(e.date)).length;

  return (
    <div>
      <h1 className="font-display text-2xl text-warm tracking-elegant mb-2">
        Anniversary Vault
      </h1>
      <p className="text-muted text-sm font-body mb-8">
        Customer occasion reminders.{" "}
        {upcomingCount > 0 && (
          <span className="text-gold">{upcomingCount} coming up in the next 30 days</span>
        )}
      </p>

      {loading ? (
        <p className="text-muted font-body">Loading...</p>
      ) : entries.length === 0 ? (
        <p className="text-muted font-body">No anniversary entries yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => {
            const upcoming = isWithin30Days(entry.date);
            const days = daysUntil(entry.date);
            return (
              <div
                key={entry.id}
                className={`bg-navy-card border rounded-sm p-5 ${
                  upcoming ? "border-gold/40" : "border-gold/10"
                }`}
              >
                {upcoming && (
                  <span className="inline-block bg-gold/20 text-gold text-xs font-body px-2 py-0.5 rounded-sm mb-3">
                    {days === 0 ? "Today!" : `${days} day${days === 1 ? "" : "s"} away`}
                  </span>
                )}
                <h3 className="font-display text-warm text-lg mb-1">{entry.name}</h3>
                <p className="text-muted text-sm font-body mb-3 capitalize">{entry.occasion}</p>
                <div className="space-y-1 text-sm font-body">
                  <p className="text-muted">
                    <span className="text-warm">Date:</span> {formatDate(entry.date)}
                  </p>
                  <p className="text-muted">
                    <span className="text-warm">Budget:</span> {entry.budget}
                  </p>
                </div>
                <a
                  href={`https://wa.me/${entry.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-gold/10 border border-gold/30 text-gold text-xs font-body px-4 py-2 rounded-sm hover:bg-gold/20 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

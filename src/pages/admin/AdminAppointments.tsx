import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Appointment {
  id: string;
  name: string;
  whatsapp: string;
  consultation_type: string | null;
  date: string;
  time_slot: string;
  notes: string | null;
  status: string | null;
  created_at: string;
}

type Filter = "upcoming" | "past" | "cancelled";

function statusColor(status: string | null): string {
  switch (status) {
    case "confirmed":
      return "bg-gold/20 text-gold";
    case "completed":
      return "bg-emerald-500/20 text-emerald-400";
    case "cancelled":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-white/10 text-muted";
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function whatsappLink(number: string, name: string): string {
  const cleaned = number.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(`Hi ${name}, just following up on your appointment at The Jewellery Studio.`);
  return `https://wa.me/${cleaned}?text=${message}`;
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("upcoming");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  async function fetchAppointments() {
    setLoading(true);
    try {
      let query = supabase
        .from("v2_appointments")
        .select("*")
        .order("date", { ascending: filter === "upcoming" });

      if (filter === "upcoming") {
        query = query.gte("date", today).neq("status", "cancelled");
      } else if (filter === "past") {
        query = query.lt("date", today).neq("status", "cancelled");
      } else if (filter === "cancelled") {
        query = query.eq("status", "cancelled");
      }

      const { data, error } = await query;
      if (error) throw error;
      setAppointments(data ?? []);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: "completed" | "cancelled") {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("v2_appointments")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  const filters: { label: string; value: Filter }[] = [
    { label: "Upcoming", value: "upcoming" },
    { label: "Past", value: "past" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-warm tracking-elegant mb-8">
        Appointments
      </h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-sm font-body px-4 py-2 rounded-sm border transition-colors ${
              filter === f.value
                ? "bg-gold/20 border-gold/30 text-gold"
                : "bg-navy-card border-gold/10 text-muted hover:text-warm hover:border-gold/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-muted font-body text-sm py-12 text-center">
          Loading appointments...
        </div>
      )}

      {/* Empty state */}
      {!loading && appointments.length === 0 && (
        <div className="text-muted font-body text-sm py-12 text-center">
          No {filter} appointments.
        </div>
      )}

      {/* Appointment cards */}
      {!loading && appointments.length > 0 && (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt.id}
              className="bg-navy-card border border-gold/10 rounded-sm p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left: details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-warm text-lg">
                      {appt.name}
                    </span>
                    <span
                      className={`text-xs font-body px-2.5 py-0.5 rounded-sm ${statusColor(appt.status)}`}
                    >
                      {appt.status ?? "unknown"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-body text-muted">
                    <span>{formatDate(appt.date)}</span>
                    <span>{appt.time_slot}</span>
                    {appt.consultation_type && (
                      <span className="text-warm">{appt.consultation_type}</span>
                    )}
                  </div>

                  {appt.notes && (
                    <p className="text-muted text-xs font-body mt-1">
                      {appt.notes}
                    </p>
                  )}
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={whatsappLink(appt.whatsapp, appt.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-body px-3 py-1.5 rounded-sm bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                  >
                    WhatsApp
                  </a>

                  {appt.status === "confirmed" && (
                    <>
                      <button
                        onClick={() => updateStatus(appt.id, "completed")}
                        disabled={updatingId === appt.id}
                        className="text-xs font-body px-3 py-1.5 rounded-sm bg-gold/10 text-gold hover:bg-gold/20 transition-colors disabled:opacity-50"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => updateStatus(appt.id, "cancelled")}
                        disabled={updatingId === appt.id}
                        className="text-xs font-body px-3 py-1.5 rounded-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

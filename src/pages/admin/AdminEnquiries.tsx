import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Enquiry {
  id: string;
  name: string;
  whatsapp: string;
  type: string;
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  status: string;
}

type FilterTab = "all" | "new" | "replied" | "closed";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-gold/20 text-gold border-gold/40",
  replied: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  closed: "bg-white/10 text-muted border-white/10",
};

const TYPE_COLORS = "bg-gold/10 text-gold border-gold/20";

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Replied", value: "replied" },
  { label: "Closed", value: "closed" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(text: string, max = 120): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "...";
}

function formatWhatsApp(number: string): string {
  const cleaned = number.replace(/[^0-9]/g, "");
  return cleaned;
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    try {
      const { data, error } = await supabase
        .from("v2_enquiries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEnquiries(data ?? []);
    } catch (err) {
      console.error("Failed to fetch enquiries:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("v2_enquiries")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingId(null);
    }
  }

  const filtered =
    activeTab === "all"
      ? enquiries
      : enquiries.filter((e) => e.status === activeTab);

  const tabCounts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    replied: enquiries.filter((e) => e.status === "replied").length,
    closed: enquiries.filter((e) => e.status === "closed").length,
  };

  return (
    <div>
      <h1 className="font-display text-2xl text-warm tracking-elegant mb-8">
        Enquiries
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`font-body text-sm px-4 py-2 rounded-sm border transition-colors ${
              activeTab === tab.value
                ? "bg-gold/20 border-gold/40 text-gold"
                : "bg-navy-card border-gold/10 text-muted hover:text-warm hover:border-gold/20"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 opacity-60">{tabCounts[tab.value]}</span>
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-muted font-body text-sm py-12 text-center">
          Loading enquiries...
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-muted font-body text-sm py-12 text-center">
          No {activeTab === "all" ? "" : activeTab + " "}enquiries found.
        </div>
      )}

      {/* Enquiry cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((enquiry) => {
          const isExpanded = expandedId === enquiry.id;

          return (
            <div
              key={enquiry.id}
              className="bg-navy-card border border-gold/10 rounded-sm overflow-hidden"
            >
              {/* Card header - clickable */}
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : enquiry.id)
                }
                className="w-full text-left p-5 hover:bg-gold/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Name + type badge */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-display text-warm text-base">
                        {enquiry.name}
                      </span>
                      <span
                        className={`text-xs font-body px-2 py-0.5 rounded-sm border capitalize ${TYPE_COLORS}`}
                      >
                        {enquiry.type}
                      </span>
                    </div>

                    {/* Message preview */}
                    <p className="text-muted text-sm font-body leading-relaxed">
                      {isExpanded
                        ? enquiry.message
                        : truncate(enquiry.message)}
                    </p>
                  </div>

                  {/* Right side: status + date */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`text-xs font-body px-2.5 py-1 rounded-sm border capitalize ${
                        STATUS_COLORS[enquiry.status] ?? STATUS_COLORS.closed
                      }`}
                    >
                      {enquiry.status}
                    </span>
                    <span className="text-muted text-xs font-body whitespace-nowrap">
                      {formatDate(enquiry.created_at)}
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded section */}
              {isExpanded && (
                <div className="border-t border-gold/10 px-5 py-4 flex flex-wrap items-center gap-4">
                  {/* WhatsApp link */}
                  <a
                    href={`https://wa.me/${formatWhatsApp(enquiry.whatsapp)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm font-body px-4 py-2 rounded-sm hover:bg-emerald-600/30 transition-colors"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.86L0 24l6.335-1.494A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.875 0-3.63-.5-5.14-1.375l-.365-.22-3.79.895.955-3.494-.24-.382A9.71 9.71 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
                    </svg>
                    Message on WhatsApp
                  </a>

                  {/* WhatsApp number display */}
                  <span className="text-muted text-sm font-body">
                    {enquiry.whatsapp}
                  </span>

                  {/* Status dropdown */}
                  <div className="ml-auto flex items-center gap-2">
                    <label className="text-muted text-xs font-body">
                      Status:
                    </label>
                    <select
                      value={enquiry.status}
                      onChange={(e) =>
                        updateStatus(enquiry.id, e.target.value)
                      }
                      disabled={updatingId === enquiry.id}
                      className="bg-navy-card border border-gold/20 text-warm text-sm font-body px-3 py-1.5 rounded-sm focus:outline-none focus:border-gold/40 disabled:opacity-50"
                    >
                      <option value="new">New</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface VaultApplication {
  id: string;
  name: string;
  whatsapp: string;
  reason: string;
  status: "pending" | "approved" | "declined";
  access_token: string | null;
  created_at: string;
}

type FilterStatus = "all" | "pending" | "approved" | "declined";

function generateToken(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export default function AdminVaultApps() {
  const [apps, setApps] = useState<VaultApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    setLoading(true);
    const { data, error } = await supabase
      .from("v2_vault_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch vault applications:", error);
    } else {
      setApps((data as VaultApplication[]) || []);
    }
    setLoading(false);
  }

  async function handleApprove(app: VaultApplication) {
    const token = generateToken();
    const { error } = await supabase
      .from("v2_vault_applications")
      .update({ status: "approved", access_token: token })
      .eq("id", app.id);

    if (error) {
      console.error("Failed to approve application:", error);
    } else {
      fetchApps();
    }
  }

  async function handleDecline(app: VaultApplication) {
    const { error } = await supabase
      .from("v2_vault_applications")
      .update({ status: "declined" })
      .eq("id", app.id);

    if (error) {
      console.error("Failed to decline application:", error);
    } else {
      fetchApps();
    }
  }

  function copyToken(id: string, token: string) {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const filtered = filter === "all" ? apps : apps.filter((a) => a.status === filter);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400",
    approved: "bg-green-500/10 text-green-400",
    declined: "bg-red-500/10 text-red-400",
  };

  const filters: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Declined", value: "declined" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-warm tracking-elegant mb-2">
        Vault Applications
      </h1>
      <p className="text-muted text-sm font-body mb-6">
        Review and manage private vault access requests.
      </p>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-xs font-body px-3 py-1.5 rounded-sm border transition-colors ${
              filter === f.value
                ? "border-gold/30 bg-gold/10 text-gold"
                : "border-gold/10 text-muted hover:text-warm"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted font-body">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted font-body">
          {filter === "all" ? "No applications yet." : `No ${filter} applications.`}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-navy-card border border-gold/10 rounded-sm p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-display text-warm">{app.name}</h3>
                    <span
                      className={`text-xs font-body px-2 py-0.5 rounded-sm capitalize ${statusColors[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-muted text-sm font-body mb-1">{app.reason}</p>
                  <p className="text-muted/50 text-xs font-body">{formatDate(app.created_at)}</p>

                  {app.status === "approved" && app.access_token && (
                    <div className="mt-3 bg-navy border border-gold/10 rounded-sm p-3">
                      <p className="text-muted text-xs font-body mb-1">Access Token:</p>
                      <div className="flex items-center gap-2">
                        <code className="text-gold text-sm font-mono">{app.access_token}</code>
                        <button
                          onClick={() => copyToken(app.id, app.access_token!)}
                          className="text-muted hover:text-warm text-xs font-body transition-colors"
                        >
                          {copiedId === app.id ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <p className="text-muted/50 text-xs font-body mt-1">
                        Vault URL: /vault?token={app.access_token}
                      </p>
                    </div>
                  )}
                </div>

                {app.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(app)}
                      className="bg-gold text-navy text-xs font-body font-semibold px-4 py-2 rounded-sm hover:bg-gold/90 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(app)}
                      className="border border-red-400/30 text-red-400 text-xs font-body px-4 py-2 rounded-sm hover:bg-red-400/10 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

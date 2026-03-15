import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

interface DashboardCounts {
  products: number;
  newEnquiries: number;
  activeRepairs: number;
  upcomingAppointments: number;
  pendingVault: number;
  publishedPosts: number;
}

const defaultCounts: DashboardCounts = {
  products: 0,
  newEnquiries: 0,
  activeRepairs: 0,
  upcomingAppointments: 0,
  pendingVault: 0,
  publishedPosts: 0,
};

export default function AdminDashboard() {
  const [counts, setCounts] = useState<DashboardCounts>(defaultCounts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const today = new Date().toISOString().split("T")[0];

        const [
          productsRes,
          enquiriesRes,
          repairsRes,
          appointmentsRes,
          vaultRes,
          blogRes,
        ] = await Promise.all([
          supabase.from("products").select("id", { count: "exact", head: true }),
          supabase.from("v2_enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
          supabase.from("v2_repairs").select("id", { count: "exact", head: true }).lt("stage", 5),
          supabase.from("v2_appointments").select("id", { count: "exact", head: true }).gte("date", today),
          supabase.from("v2_vault_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("v2_blog_posts").select("id", { count: "exact", head: true }).eq("published", true),
        ]);

        setCounts({
          products: productsRes.count ?? 0,
          newEnquiries: enquiriesRes.count ?? 0,
          activeRepairs: repairsRes.count ?? 0,
          upcomingAppointments: appointmentsRes.count ?? 0,
          pendingVault: vaultRes.count ?? 0,
          publishedPosts: blogRes.count ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCounts();
  }, []);

  const cards = [
    {
      label: "Total Products",
      count: counts.products,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2" width="5" height="5" rx="0.5" />
          <rect x="7.5" y="2" width="5" height="5" rx="0.5" />
          <rect x="13" y="2" width="5" height="5" rx="0.5" />
          <rect x="2" y="7.5" width="5" height="5" rx="0.5" />
          <rect x="7.5" y="7.5" width="5" height="5" rx="0.5" />
          <rect x="13" y="7.5" width="5" height="5" rx="0.5" />
          <rect x="2" y="13" width="5" height="5" rx="0.5" />
          <rect x="7.5" y="13" width="5" height="5" rx="0.5" />
          <rect x="13" y="13" width="5" height="5" rx="0.5" />
        </svg>
      ),
    },
    {
      label: "New Enquiries",
      count: counts.newEnquiries,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 3V5a1 1 0 011-1z" />
        </svg>
      ),
    },
    {
      label: "Active Repairs",
      count: counts.activeRepairs,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14.5 3.5l2 2M5 13l-2 4 4-2 9-9-2-2-9 9z" />
          <path d="M12 6l2 2" />
        </svg>
      ),
    },
    {
      label: "Upcoming Appointments",
      count: counts.upcomingAppointments,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="3" width="16" height="15" rx="1" />
          <path d="M2 7h16" />
          <path d="M6 1v4M14 1v4" />
        </svg>
      ),
    },
    {
      label: "Vault Applications Pending",
      count: counts.pendingVault,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="8" width="12" height="10" rx="1" />
          <path d="M7 8V5a3 3 0 016 0v3" />
          <circle cx="10" cy="13" r="1.5" />
        </svg>
      ),
    },
    {
      label: "Blog Posts Published",
      count: counts.publishedPosts,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2l4 4-10 10H4v-4L14 2z" />
          <path d="M12 4l4 4" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    { label: "Add Product", to: "/admin/inventory" },
    { label: "Write Blog Post", to: "/admin/blog" },
    { label: "Add Cruise Ship", to: "/admin/cruise" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-warm tracking-elegant mb-8">
        Dashboard
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-navy-card border border-gold/10 rounded-sm p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-muted">{card.icon}</span>
              <span className="text-muted text-sm font-body">{card.label}</span>
            </div>
            <p className="text-gold text-3xl font-display">
              {loading ? "..." : card.count}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="font-display text-lg text-warm tracking-elegant mb-4">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className="bg-gold/10 border border-gold/30 text-gold text-sm font-body px-5 py-2.5 rounded-sm hover:bg-gold/20 transition-colors"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

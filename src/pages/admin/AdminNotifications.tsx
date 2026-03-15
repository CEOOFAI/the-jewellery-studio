import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface NotificationSub {
  id: string;
  whatsapp: string;
  categories: string[];
  created_at: string;
}

export default function AdminNotifications() {
  const [subs, setSubs] = useState<NotificationSub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubs();
  }, []);

  async function fetchSubs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("v2_category_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch notification subscribers:", error);
    } else {
      setSubs(data || []);
    }
    setLoading(false);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div>
      <h1 className="font-display text-2xl text-warm tracking-elegant mb-2">
        Category Notifications
      </h1>
      <p className="text-muted text-sm font-body mb-8">
        Customers who want WhatsApp alerts for new stock.
      </p>

      {loading ? (
        <p className="text-muted font-body">Loading...</p>
      ) : (
        <>
          <div className="bg-navy-card border border-gold/10 rounded-sm p-4 mb-6 inline-block">
            <span className="text-muted text-sm font-body">Total subscribers: </span>
            <span className="text-gold font-display text-xl">{subs.length}</span>
          </div>

          {subs.length === 0 ? (
            <p className="text-muted font-body">No subscribers yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-gold/10">
                    <th className="text-left text-muted py-3 px-4 font-normal">WhatsApp</th>
                    <th className="text-left text-muted py-3 px-4 font-normal">Categories</th>
                    <th className="text-left text-muted py-3 px-4 font-normal">Signed Up</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((sub) => (
                    <tr key={sub.id} className="border-b border-gold/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <a
                          href={`https://wa.me/${sub.whatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold hover:text-gold/80"
                        >
                          {sub.whatsapp}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {sub.categories.map((cat) => (
                            <span
                              key={cat}
                              className="bg-gold/10 text-gold text-xs px-2 py-0.5 rounded-sm"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted">{formatDate(sub.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

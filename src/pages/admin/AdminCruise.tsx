import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface CruiseShip {
  id: string;
  ship_name: string;
  arrival_date: string;
  departure_date: string;
  created_at: string;
}

const emptyForm = { ship_name: "", arrival_date: "", departure_date: "" };

export default function AdminCruise() {
  const [ships, setShips] = useState<CruiseShip[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchShips();
  }, []);

  async function fetchShips() {
    setLoading(true);
    const { data, error } = await supabase
      .from("v2_cruise_schedule")
      .select("*")
      .order("arrival_date", { ascending: true });

    if (error) {
      console.error("Failed to fetch cruise schedule:", error);
    } else {
      setShips(data || []);
    }
    setLoading(false);
  }

  function isToday(dateStr: string): boolean {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(ship: CruiseShip) {
    setEditingId(ship.id);
    setForm({
      ship_name: ship.ship_name,
      arrival_date: ship.arrival_date,
      departure_date: ship.departure_date,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.ship_name || !form.arrival_date || !form.departure_date) return;
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from("v2_cruise_schedule")
        .update({
          ship_name: form.ship_name,
          arrival_date: form.arrival_date,
          departure_date: form.departure_date,
        })
        .eq("id", editingId);

      if (error) console.error("Failed to update ship:", error);
    } else {
      const { error } = await supabase.from("v2_cruise_schedule").insert({
        ship_name: form.ship_name,
        arrival_date: form.arrival_date,
        departure_date: form.departure_date,
      });

      if (error) console.error("Failed to add ship:", error);
    }

    setSaving(false);
    setModalOpen(false);
    fetchShips();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this ship from the schedule?")) return;
    const { error } = await supabase.from("v2_cruise_schedule").delete().eq("id", id);
    if (error) console.error("Failed to delete ship:", error);
    fetchShips();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl text-warm tracking-elegant mb-1">
            Cruise Schedule
          </h1>
          <p className="text-muted text-sm font-body">Manage upcoming cruise ship arrivals.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-gold text-navy text-sm font-body font-semibold px-5 py-2.5 rounded-sm hover:bg-gold/90 transition-colors"
        >
          Add Ship
        </button>
      </div>

      {loading ? (
        <p className="text-muted font-body">Loading...</p>
      ) : ships.length === 0 ? (
        <p className="text-muted font-body">No ships scheduled.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-left text-muted py-3 px-4 font-normal">Ship Name</th>
                <th className="text-left text-muted py-3 px-4 font-normal">Arrival</th>
                <th className="text-left text-muted py-3 px-4 font-normal">Departure</th>
                <th className="text-right text-muted py-3 px-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ships.map((ship) => {
                const arriving = isToday(ship.arrival_date);
                return (
                  <tr
                    key={ship.id}
                    className={`border-b border-gold/5 transition-colors ${
                      arriving ? "bg-gold/5" : "hover:bg-white/5"
                    }`}
                  >
                    <td className={`py-3 px-4 ${arriving ? "text-gold font-semibold" : "text-warm"}`}>
                      {ship.ship_name}
                      {arriving && (
                        <span className="ml-2 bg-gold/20 text-gold text-xs px-2 py-0.5 rounded-sm">
                          Today
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted">{formatDate(ship.arrival_date)}</td>
                    <td className="py-3 px-4 text-muted">{formatDate(ship.departure_date)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openEdit(ship)}
                        className="text-gold/70 hover:text-gold text-xs mr-3 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ship.id)}
                        className="text-red-400/70 hover:text-red-400 text-xs transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-card border border-gold/10 rounded-sm w-full max-w-md p-6">
            <h2 className="font-display text-lg text-warm tracking-elegant mb-6">
              {editingId ? "Edit Ship" : "Add Ship"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-muted text-xs font-body mb-1">Ship Name</label>
                <input
                  type="text"
                  value={form.ship_name}
                  onChange={(e) => setForm({ ...form, ship_name: e.target.value })}
                  className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none"
                  placeholder="e.g. MSC Virtuosa"
                />
              </div>
              <div>
                <label className="block text-muted text-xs font-body mb-1">Arrival Date</label>
                <input
                  type="date"
                  value={form.arrival_date}
                  onChange={(e) => setForm({ ...form, arrival_date: e.target.value })}
                  className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-muted text-xs font-body mb-1">Departure Date</label>
                <input
                  type="date"
                  value={form.departure_date}
                  onChange={(e) => setForm({ ...form, departure_date: e.target.value })}
                  className="w-full bg-navy border border-gold/10 text-warm text-sm font-body rounded-sm px-3 py-2 focus:border-gold/30 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted text-sm font-body px-4 py-2 hover:text-warm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.ship_name || !form.arrival_date || !form.departure_date}
                className="bg-gold text-navy text-sm font-body font-semibold px-5 py-2 rounded-sm hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

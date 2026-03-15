import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Repair {
  id: string;
  reference_code: string;
  customer_name: string | null;
  customer_whatsapp: string | null;
  description: string | null;
  stage: number;
  estimated_completion: string | null;
  created_at: string;
  updated_at: string;
}

interface RepairForm {
  customer_name: string;
  customer_whatsapp: string;
  description: string;
  estimated_completion: string;
}

const STAGES: Record<number, string> = {
  1: "Received",
  2: "Assessed",
  3: "In Progress",
  4: "Quality Check",
  5: "Ready for Collection",
};

function stageBadgeClass(stage: number): string {
  switch (stage) {
    case 1:
      return "bg-white/5 text-muted border border-white/10";
    case 2:
      return "bg-white/10 text-muted border border-white/15";
    case 3:
      return "bg-gold/15 text-gold border border-gold/30";
    case 4:
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case 5:
      return "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
    default:
      return "bg-white/5 text-muted border border-white/10";
  }
}

function generateReferenceCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const emptyForm: RepairForm = {
  customer_name: "",
  customer_whatsapp: "",
  description: "",
  estimated_completion: "",
};

export default function AdminRepairs() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RepairForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  async function fetchRepairs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("v2_repairs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch repairs:", error);
    } else {
      setRepairs(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchRepairs();
  }, []);

  function openAddModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(repair: Repair) {
    setEditingId(repair.id);
    setForm({
      customer_name: repair.customer_name ?? "",
      customer_whatsapp: repair.customer_whatsapp ?? "",
      description: repair.description ?? "",
      estimated_completion: repair.estimated_completion ?? "",
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSave() {
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from("v2_repairs")
        .update({
          customer_name: form.customer_name || null,
          customer_whatsapp: form.customer_whatsapp || null,
          description: form.description || null,
          estimated_completion: form.estimated_completion || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);

      if (error) {
        console.error("Failed to update repair:", error);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("v2_repairs").insert({
        reference_code: generateReferenceCode(),
        customer_name: form.customer_name || null,
        customer_whatsapp: form.customer_whatsapp || null,
        description: form.description || null,
        stage: 1,
        estimated_completion: form.estimated_completion || null,
      });

      if (error) {
        console.error("Failed to create repair:", error);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    closeModal();
    fetchRepairs();
  }

  async function advanceStage(repair: Repair) {
    if (repair.stage >= 5) return;

    const { error } = await supabase
      .from("v2_repairs")
      .update({
        stage: repair.stage + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", repair.id);

    if (error) {
      console.error("Failed to advance stage:", error);
      return;
    }

    fetchRepairs();
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("v2_repairs").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete repair:", error);
      return;
    }

    setDeleteConfirmId(null);
    fetchRepairs();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-warm tracking-elegant">
          Repairs
        </h1>
        <button
          onClick={openAddModal}
          className="bg-gold/10 border border-gold/30 text-gold text-sm font-body px-5 py-2.5 rounded-sm hover:bg-gold/20 transition-colors"
        >
          Add Repair
        </button>
      </div>

      {loading ? (
        <div className="text-muted font-body text-sm">Loading repairs...</div>
      ) : repairs.length === 0 ? (
        <div className="text-muted font-body text-sm">
          No repairs found. Click "Add Repair" to create one.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="text-muted text-xs font-body uppercase tracking-wider pb-3 pr-4">
                  Reference
                </th>
                <th className="text-muted text-xs font-body uppercase tracking-wider pb-3 pr-4">
                  Customer
                </th>
                <th className="text-muted text-xs font-body uppercase tracking-wider pb-3 pr-4 hidden sm:table-cell">
                  Description
                </th>
                <th className="text-muted text-xs font-body uppercase tracking-wider pb-3 pr-4">
                  Stage
                </th>
                <th className="text-muted text-xs font-body uppercase tracking-wider pb-3 pr-4 hidden md:table-cell">
                  Est. Completion
                </th>
                <th className="text-muted text-xs font-body uppercase tracking-wider pb-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {repairs.map((repair) => (
                <tr
                  key={repair.id}
                  className="border-b border-gold/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 pr-4">
                    <span className="font-body text-sm text-warm font-mono tracking-wide">
                      {repair.reference_code}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-body text-sm text-warm">
                      {repair.customer_name ?? "-"}
                    </span>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <span className="font-body text-sm text-muted max-w-[200px] truncate block">
                      {repair.description ?? "-"}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span
                      className={`inline-block text-xs font-body px-2.5 py-1 rounded-sm ${stageBadgeClass(repair.stage)}`}
                    >
                      {STAGES[repair.stage]}
                    </span>
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell">
                    <span className="font-body text-sm text-muted">
                      {repair.estimated_completion ?? "-"}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {repair.stage < 5 && (
                        <button
                          onClick={() => advanceStage(repair)}
                          className="text-xs font-body text-gold hover:text-gold/80 transition-colors"
                          title={`Advance to ${STAGES[repair.stage + 1]}`}
                        >
                          Advance
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(repair)}
                        className="text-xs font-body text-muted hover:text-warm transition-colors"
                      >
                        Edit
                      </button>
                      {deleteConfirmId === repair.id ? (
                        <span className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(repair.id)}
                            className="text-xs font-body text-red-400 hover:text-red-300 transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-xs font-body text-muted hover:text-warm transition-colors"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(repair.id)}
                          className="text-xs font-body text-muted hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={closeModal}
          />
          <div className="relative bg-navy-card border border-gold/10 rounded-sm p-6 w-full max-w-md mx-4">
            <h2 className="font-display text-lg text-warm tracking-elegant mb-6">
              {editingId ? "Edit Repair" : "Add Repair"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-muted text-xs font-body uppercase tracking-wider mb-1.5">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={(e) =>
                    setForm({ ...form, customer_name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-gold/10 rounded-sm px-3 py-2 text-warm text-sm font-body focus:outline-none focus:border-gold/30 transition-colors"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-muted text-xs font-body uppercase tracking-wider mb-1.5">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={form.customer_whatsapp}
                  onChange={(e) =>
                    setForm({ ...form, customer_whatsapp: e.target.value })
                  }
                  className="w-full bg-white/5 border border-gold/10 rounded-sm px-3 py-2 text-warm text-sm font-body focus:outline-none focus:border-gold/30 transition-colors"
                  placeholder="+350 ..."
                />
              </div>

              <div>
                <label className="block text-muted text-xs font-body uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-white/5 border border-gold/10 rounded-sm px-3 py-2 text-warm text-sm font-body focus:outline-none focus:border-gold/30 transition-colors resize-none"
                  placeholder="What needs repairing?"
                />
              </div>

              <div>
                <label className="block text-muted text-xs font-body uppercase tracking-wider mb-1.5">
                  Estimated Completion
                </label>
                <input
                  type="date"
                  value={form.estimated_completion}
                  onChange={(e) =>
                    setForm({ ...form, estimated_completion: e.target.value })
                  }
                  className="w-full bg-white/5 border border-gold/10 rounded-sm px-3 py-2 text-warm text-sm font-body focus:outline-none focus:border-gold/30 transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="text-sm font-body text-muted hover:text-warm transition-colors px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gold/10 border border-gold/30 text-gold text-sm font-body px-5 py-2.5 rounded-sm hover:bg-gold/20 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

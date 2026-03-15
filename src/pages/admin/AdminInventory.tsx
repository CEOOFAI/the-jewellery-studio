import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import type { Product } from "../../lib/supabase";
import { CATEGORY_LABELS } from "../../lib/constants";

const CATEGORIES = Object.keys(CATEGORY_LABELS);

const emptyForm = {
  name: "",
  description: "",
  selling_price: "",
  category: CATEGORIES[0],
  image_url: "",
  featured: false,
  active: true,
};

type FormData = typeof emptyForm;

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setForm({
      name: product.name,
      description: product.description || "",
      selling_price: product.selling_price?.toString() || "",
      category: product.category,
      image_url: product.image_url || "",
      featured: product.featured,
      active: product.active,
    });
    setEditingId(product.id);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;

    setSaving(true);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      selling_price: form.selling_price ? parseFloat(form.selling_price) : null,
      category: form.category,
      image_url: form.image_url.trim() || null,
      featured: form.featured,
      active: form.active,
    };

    if (editingId) {
      await supabase.from("products").update(payload).eq("id", editingId);
    } else {
      await supabase.from("products").insert(payload);
    }

    setSaving(false);
    closeModal();
    fetchProducts();
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  }

  async function toggleActive(product: Product) {
    await supabase
      .from("products")
      .update({ active: !product.active })
      .eq("id", product.id);
    fetchProducts();
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-gold tracking-elegant uppercase">
          Inventory
        </h1>
        <button
          onClick={openAdd}
          className="px-4 py-2 bg-gold/10 border border-gold/30 text-gold text-sm font-body rounded hover:bg-gold/20 transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted text-sm font-body">No products yet.</p>
          <button
            onClick={openAdd}
            className="mt-4 text-gold text-sm font-body underline hover:text-gold/80"
          >
            Add your first product
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && products.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gold/10">
                <th className="pb-3 text-[10px] font-body uppercase tracking-luxe text-muted">
                  Image
                </th>
                <th className="pb-3 text-[10px] font-body uppercase tracking-luxe text-muted">
                  Name
                </th>
                <th className="pb-3 text-[10px] font-body uppercase tracking-luxe text-muted">
                  Category
                </th>
                <th className="pb-3 text-[10px] font-body uppercase tracking-luxe text-muted">
                  Price
                </th>
                <th className="pb-3 text-[10px] font-body uppercase tracking-luxe text-muted">
                  Status
                </th>
                <th className="pb-3 text-[10px] font-body uppercase tracking-luxe text-muted text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gold/5 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Thumbnail */}
                  <td className="py-3 pr-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-navy-card flex items-center justify-center">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#9BA8B5"
                          strokeWidth="1.5"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>
                    )}
                  </td>

                  {/* Name */}
                  <td className="py-3 pr-3">
                    <span className="text-warm text-sm font-body">
                      {product.name}
                    </span>
                    {product.featured && (
                      <span className="ml-2 text-[9px] font-body uppercase tracking-luxe text-gold bg-gold/10 px-1.5 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 pr-3">
                    <span className="text-muted text-sm font-body">
                      {CATEGORY_LABELS[product.category] || product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 pr-3">
                    <span className="text-warm text-sm font-body">
                      {product.selling_price
                        ? `£${product.selling_price.toLocaleString("en-GB")}`
                        : "—"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 pr-3">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`text-[10px] font-body uppercase tracking-luxe px-2 py-1 rounded transition-colors ${
                        product.active
                          ? "text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20"
                          : "text-red-400 bg-red-400/10 hover:bg-red-400/20"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="text-muted hover:text-gold text-xs font-body transition-colors px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-muted hover:text-red-400 text-xs font-body transition-colors px-2 py-1"
                      >
                        Delete
                      </button>
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-navy-deep border border-gold/10 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">
              <h2 className="font-display text-lg text-gold tracking-elegant uppercase">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-muted hover:text-warm transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M5 5l10 10M15 5L5 15" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-body uppercase tracking-luxe text-muted mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-navy border border-gold/10 rounded px-3 py-2 text-sm text-warm font-body focus:outline-none focus:border-gold/30 transition-colors"
                  placeholder="e.g. 18ct Gold Signet Ring"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-body uppercase tracking-luxe text-muted mb-1">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-navy border border-gold/10 rounded px-3 py-2 text-sm text-warm font-body focus:outline-none focus:border-gold/30 transition-colors resize-none"
                  placeholder="Brief product description"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-[10px] font-body uppercase tracking-luxe text-muted mb-1">
                  Price (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.selling_price}
                  onChange={(e) =>
                    setForm({ ...form, selling_price: e.target.value })
                  }
                  className="w-full bg-navy border border-gold/10 rounded px-3 py-2 text-sm text-warm font-body focus:outline-none focus:border-gold/30 transition-colors"
                  placeholder="Leave blank for 'Price on request'"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-body uppercase tracking-luxe text-muted mb-1">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-navy border border-gold/10 rounded px-3 py-2 text-sm text-warm font-body focus:outline-none focus:border-gold/30 transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-[10px] font-body uppercase tracking-luxe text-muted mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) =>
                    setForm({ ...form, image_url: e.target.value })
                  }
                  className="w-full bg-navy border border-gold/10 rounded px-3 py-2 text-sm text-warm font-body focus:outline-none focus:border-gold/30 transition-colors"
                  placeholder="https://..."
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm({ ...form, featured: e.target.checked })
                    }
                    className="accent-[#C9A84C] w-4 h-4"
                  />
                  <span className="text-sm text-muted font-body">Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      setForm({ ...form, active: e.target.checked })
                    }
                    className="accent-[#C9A84C] w-4 h-4"
                  />
                  <span className="text-sm text-muted font-body">Active</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 bg-gold text-navy text-sm font-body font-medium rounded hover:bg-gold/90 transition-colors disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border border-gold/10 text-muted text-sm font-body rounded hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

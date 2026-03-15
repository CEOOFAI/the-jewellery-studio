import { useState } from "react";
import { supabase } from "../lib/supabase";
import { isValidPhone } from "../lib/constants";

const categories = [
  "WATCHES",
  "ENGAGEMENT",
  "GOLD",
  "NECKLACES",
  "DIAMONDS",
  "PRE-OWNED",
] as const;

export default function NotifyMe() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [whatsapp, setWhatsapp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleCategory(cat: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (selected.size === 0) {
      setError("Pick at least one category.");
      return;
    }

    if (!whatsapp.trim() || !isValidPhone(whatsapp)) {
      setError("Enter a valid WhatsApp number.");
      return;
    }

    setSubmitting(true);

    const { error: dbError } = await supabase
      .from("v2_category_notifications")
      .insert({
        whatsapp: whatsapp.trim(),
        categories: Array.from(selected),
      });

    setSubmitting(false);

    if (dbError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
  }

  if (success) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-5">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#C9A84C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-navy mb-2">
          You're on the list!
        </h3>
        <p className="font-body text-sm text-muted max-w-md mx-auto">
          We'll message you on WhatsApp when new pieces arrive.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4">
      <h2 className="font-display text-3xl md:text-4xl text-navy mb-3">
        Get Notified
      </h2>
      <p className="font-body text-sm text-muted max-w-md mx-auto mb-8">
        Be the first to know when new pieces arrive in the categories you love.
      </p>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        {/* Category chips */}
        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`font-body text-[10px] md:text-[11px] uppercase tracking-elegant px-5 py-2 rounded-full transition-all duration-300 ${
                selected.has(cat)
                  ? "bg-gold text-white border border-gold"
                  : "bg-cream border border-navy/20 text-navy/50 hover:border-navy/40 hover:text-navy/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* WhatsApp input */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-center mb-4">
          <div className="relative flex-1 max-w-xs mx-auto sm:mx-0 w-full">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#9BA8B5"
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+350 54013690"
              className="w-full pl-10 pr-4 py-3 bg-white border border-cream-border rounded-sm font-body text-sm text-navy placeholder:text-muted/50 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-gold text-white px-7 py-3 font-body text-[11px] uppercase tracking-elegant rounded-sm hover:bg-gold-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Sending..." : "Notify Me"}
          </button>
        </div>

        {error && (
          <p className="font-body text-xs text-red-500 mt-2">{error}</p>
        )}
      </form>
    </div>
  );
}

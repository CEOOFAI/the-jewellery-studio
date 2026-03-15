import { useState } from "react";
import { supabase } from "../lib/supabase";
import { isValidPhone } from "../lib/constants";
import SectionReveal from "../components/SectionReveal";

const occasions = ["Birthday", "Anniversary", "Engagement", "Wedding", "Other"];
const budgets = [
  "Under \u00a3500",
  "\u00a3500\u2013\u00a31,000",
  "\u00a31,000\u2013\u00a32,500",
  "\u00a32,500\u2013\u00a35,000",
  "Over \u00a35,000",
];

const inputClass =
  "w-full bg-navy-card border border-gold/20 text-warm placeholder:text-dim rounded-md px-4 py-3 font-body text-sm focus:border-gold focus:outline-none transition-colors";

export default function AnniversaryVaultForm() {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [occasion, setOccasion] = useState("");
  const [date, setDate] = useState("");
  const [budget, setBudget] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidPhone(whatsapp)) {
      setError("Please enter a valid phone number.");
      return;
    }
    setSubmitting(true);
    setError("");

    const { error: dbError } = await supabase
      .from("v2_anniversary_vault")
      .insert({
        name,
        whatsapp,
        occasion,
        date,
        budget,
      });

    setSubmitting(false);

    if (dbError) {
      setError("Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <SectionReveal>
        <div className="max-w-lg mx-auto text-center py-12">
          <p className="font-display text-gold text-2xl mb-3">Date registered!</p>
          <p className="text-muted font-body text-sm">
            Michael will be in touch before the day.
          </p>
        </div>
      </SectionReveal>
    );
  }

  return (
    <SectionReveal>
      <div className="max-w-lg mx-auto">
        <h2 className="font-display text-warm text-3xl sm:text-4xl text-center mb-3">
          Never Miss a Moment.
        </h2>
        <p className="text-muted font-body text-sm text-center mb-8 leading-relaxed">
          Michael will send a personalised recommendation to your WhatsApp two
          weeks before any date you register.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />

          <input
            type="tel"
            placeholder="WhatsApp number"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className={inputClass}
          />

          <select
            required
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Occasion
            </option>
            {occasions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />

          <select
            required
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Budget range
            </option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {error && (
            <p className="text-red-400 text-xs font-body text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold/90 hover:bg-gold text-navy-deep font-body text-xs tracking-[0.2em] uppercase py-3.5 rounded-md transition-colors disabled:opacity-50"
          >
            {submitting ? "Registering..." : "REGISTER THIS DATE"}
          </button>
        </form>
      </div>
    </SectionReveal>
  );
}

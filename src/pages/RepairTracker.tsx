import { useState } from "react";
import { motion } from "framer-motion";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import useSEO from "../hooks/useSEO";
import { supabase } from "../lib/supabase";

interface Repair {
  id: string;
  reference_code: string;
  customer_name: string;
  description: string;
  stage: number;
  estimated_completion: string | null;
  created_at: string;
}

const STAGES = [
  { index: 1, label: "Received" },
  { index: 2, label: "Assessed" },
  { index: 3, label: "In Progress" },
  { index: 4, label: "Quality Check" },
  { index: 5, label: "Ready for Collection" },
] as const;

function getStageIndex(stage: number): number {
  return stage - 1; // DB uses 1-5, array uses 0-4
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );
}

function ProgressTracker({ stage }: { stage: number }) {
  const currentIndex = getStageIndex(stage);

  return (
    <div className="py-8">
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start justify-between relative">
        {/* Connecting line (behind circles) */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-white/10 mx-10" />
        <div
          className="absolute top-5 left-0 h-[2px] bg-gold mx-10 transition-all duration-700"
          style={{
            width: `${currentIndex === 0 ? 0 : (currentIndex / (STAGES.length - 1)) * 100}%`,
            maxWidth: "calc(100% - 5rem)",
          }}
        />

        {STAGES.map((s, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <div key={s.label} className="flex flex-col items-center z-10 flex-1">
              {/* Circle */}
              <div className="relative">
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
                )}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-body transition-all duration-500 ${
                    isCompleted
                      ? "bg-gold text-white"
                      : isCurrent
                        ? "bg-gold text-white"
                        : "bg-navy-deep border border-gold/30 text-muted"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
              </div>
              {/* Label */}
              <p
                className={`mt-3 text-xs font-body text-center ${
                  isFuture ? "text-muted" : "text-warm"
                }`}
              >
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden flex flex-col gap-0">
        {STAGES.map((s, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;
          const isLast = i === STAGES.length - 1;

          return (
            <div key={s.label} className="flex items-start gap-4">
              {/* Circle + line column */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />
                  )}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-body transition-all duration-500 ${
                      isCompleted
                        ? "bg-gold text-white"
                        : isCurrent
                          ? "bg-gold text-white"
                          : "bg-navy-deep border border-gold/30 text-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                </div>
                {!isLast && (
                  <div
                    className={`w-[2px] h-8 ${
                      i < currentIndex ? "bg-gold" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
              {/* Label */}
              <div className="pt-2.5 pb-4">
                <p
                  className={`text-sm font-body ${
                    isFuture ? "text-muted" : "text-warm"
                  }`}
                >
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RepairTracker() {
  useSEO({
    title: "Repair Tracker | The Jewellery Studio",
    description: "Track the progress of your jewellery repair with your reference code.",
    url: "/repair-tracker",
  });

  const [code, setCode] = useState("");
  const [repair, setRepair] = useState<Repair | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const whatsappUrl = `https://wa.me/35054013690?text=${encodeURIComponent(
    `Hi Michael, I have a question about my repair${code ? ` (ref: ${code})` : ""}.`
  )}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) return;

    setLoading(true);
    setError(null);
    setRepair(null);
    setSearched(true);

    const { data, error: err } = await supabase
      .from("v2_repairs")
      .select("id, reference_code, customer_name, description, stage, estimated_completion, created_at")
      .eq("reference_code", trimmed)
      .single();

    setLoading(false);

    if (err || !data) {
      setError("No repair found with that code.");
      return;
    }

    setRepair(data as Repair);
  }

  return (
    <div className="bg-navy min-h-screen pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <SectionReveal className="text-center">
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            REPAIR STATUS
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-warm">
            Track Your Repair
          </h1>
          <GoldDivider className="mt-4 mb-6" />
          <p className="font-body text-sm text-muted leading-relaxed max-w-md mx-auto">
            Enter the 6-character reference code Michael gave you when you
            dropped off your piece.
          </p>
        </SectionReveal>

        {/* Input Section */}
        <SectionReveal delay={0.1}>
          <form
            onSubmit={handleSubmit}
            className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="text"
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="e.g. A7X3K9"
              maxLength={6}
              className="flex-1 bg-navy-card border border-gold/30 text-warm font-body text-center text-lg tracking-[0.3em] px-4 py-3 rounded-sm placeholder:text-muted/40 placeholder:tracking-[0.2em] placeholder:text-sm focus:border-gold focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={code.trim().length !== 6 || loading}
              className="bg-gold text-white font-body text-xs uppercase tracking-elegant px-8 py-3 rounded-sm hover:bg-gold-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Track
            </button>
          </form>
        </SectionReveal>

        {/* Loading */}
        {loading && <Spinner />}

        {/* Error State */}
        {error && searched && !loading && (
          <SectionReveal>
            <div className="mt-10 text-center">
              <div className="bg-navy-card border border-gold/20 rounded-sm p-8 max-w-md mx-auto">
                <p className="font-display text-xl text-warm mb-2">
                  No repair found
                </p>
                <p className="font-body text-sm text-muted mb-6">
                  We couldn't find a repair with that reference code. Double
                  check the code and try again, or get in touch with Michael
                  directly.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold text-white font-body text-xs uppercase tracking-elegant px-6 py-3 rounded-sm hover:bg-gold-muted transition-colors"
                >
                  <WhatsAppIcon />
                  Message Michael
                </a>
              </div>
            </div>
          </SectionReveal>
        )}

        {/* Results */}
        {repair && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            {/* Greeting */}
            <div className="text-center mb-2">
              <p className="font-body text-sm text-muted">
                Showing repair status for
              </p>
              <p className="font-display text-2xl text-warm mt-1">
                {repair.customer_name}
              </p>
            </div>

            <GoldDivider width={40} className="mb-8" />

            {/* Progress Tracker */}
            <div className="bg-navy-card border border-gold/10 rounded-sm p-6 md:p-8">
              <ProgressTracker stage={repair.stage} />
            </div>

            {/* Repair Details */}
            <div className="mt-6 bg-navy-card border border-gold/10 rounded-sm p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-luxe text-gold mb-1">
                    Item
                  </p>
                  <p className="font-body text-sm text-warm">
                    {repair.description}
                  </p>
                </div>

                <div>
                  <p className="font-body text-[10px] uppercase tracking-luxe text-gold mb-1">
                    Reference
                  </p>
                  <p className="font-body text-sm text-warm tracking-widest">
                    {repair.reference_code}
                  </p>
                </div>

                <div>
                  <p className="font-body text-[10px] uppercase tracking-luxe text-gold mb-1">
                    Date Received
                  </p>
                  <p className="font-body text-sm text-warm">
                    {formatDate(repair.created_at)}
                  </p>
                </div>

                {repair.estimated_completion && (
                  <div>
                    <p className="font-body text-[10px] uppercase tracking-luxe text-gold mb-1">
                      Estimated Completion
                    </p>
                    <p className="font-body text-sm text-warm">
                      {formatDate(repair.estimated_completion)}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        )}

        {/* WhatsApp CTA */}
        <SectionReveal delay={0.2}>
          <div className="mt-16 text-center">
            <p className="font-body text-sm text-muted mb-4">
              Have questions about your repair?
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-white font-body text-xs uppercase tracking-elegant px-6 py-3 rounded-sm hover:bg-gold-muted transition-colors"
            >
              <WhatsAppIcon />
              Message Michael on WhatsApp
            </a>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}

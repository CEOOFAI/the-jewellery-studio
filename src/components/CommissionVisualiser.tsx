import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

/* ── Types ── */

type PieceType = "Ring" | "Necklace" | "Bracelet" | "Earrings" | "Brooch" | "Other";
type Metal = "9ct Gold" | "14ct Gold" | "18ct Gold" | "Platinum" | "Silver" | "Rose Gold";
type Stone = "Diamond" | "Ruby" | "Sapphire" | "Emerald" | "Pearl" | "None" | "Other";
type Budget =
  | "Under £500"
  | "£500 - £1,000"
  | "£1,000 - £2,500"
  | "£2,500 - £5,000"
  | "£5,000+"
  | "Not sure yet";

interface FormData {
  pieceType: PieceType | null;
  metal: Metal | null;
  stone: Stone | null;
  budget: Budget | null;
  inspiration: string;
  fileName: string;
}

const TOTAL_STEPS = 6;
const WA_NUMBER = "35054013690";

/* ── Icons ── */

function PieceIcon({ type }: { type: PieceType }) {
  const base = "w-8 h-8 text-gold";
  switch (type) {
    case "Ring":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="14" r="7" />
          <path d="M9 7.5 12 3l3 4.5" />
        </svg>
      );
    case "Necklace":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 4c0 8 3 14 7 16 4-2 7-8 7-16" />
          <circle cx="12" cy="20" r="2" fill="currentColor" />
        </svg>
      );
    case "Bracelet":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="12" cy="12" rx="9" ry="5" />
          <ellipse cx="12" cy="12" rx="6" ry="3" />
        </svg>
      );
    case "Earrings":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 4v4a4 4 0 0 0 4 4" />
          <circle cx="8" cy="16" r="3" />
          <path d="M16 4v4a4 4 0 0 1-4 4" />
          <circle cx="16" cy="16" r="3" />
        </svg>
      );
    case "Brooch":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2 9 9H2l6 5-2 8 6-5 6 5-2-8 6-5h-7z" />
        </svg>
      );
    case "Other":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a3 3 0 0 1 5 1c0 2-3 2.5-3 5" />
          <circle cx="12" cy="18" r=".5" fill="currentColor" />
        </svg>
      );
  }
}

/* ── Selection Card ── */

function SelectionCard<T extends string>({
  label,
  value,
  selected,
  onSelect,
  children,
}: {
  label: string;
  value: T;
  selected: boolean;
  onSelect: (v: T) => void;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex flex-col items-center justify-center gap-2 p-5 rounded-sm cursor-pointer transition-all duration-200 ${
        selected
          ? "border-gold bg-gold/10 border"
          : "bg-navy-card border border-gold/20 hover:border-gold/60"
      }`}
    >
      {children}
      <span className="font-body text-sm text-warm">{label}</span>
    </button>
  );
}

/* ── Step components ── */

function StepPieceType({
  value,
  onChange,
}: {
  value: PieceType | null;
  onChange: (v: PieceType) => void;
}) {
  const options: PieceType[] = ["Ring", "Necklace", "Bracelet", "Earrings", "Brooch", "Other"];
  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl text-warm mb-2 text-center">
        What would you like made?
      </h3>
      <p className="font-body text-muted text-sm text-center mb-8">
        Pick the type of piece you're dreaming of.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((o) => (
          <SelectionCard key={o} label={o} value={o} selected={value === o} onSelect={onChange}>
            <PieceIcon type={o} />
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}

function StepMetal({
  value,
  onChange,
}: {
  value: Metal | null;
  onChange: (v: Metal) => void;
}) {
  const options: Metal[] = ["9ct Gold", "14ct Gold", "18ct Gold", "Platinum", "Silver", "Rose Gold"];
  const colours: Record<Metal, string> = {
    "9ct Gold": "#D4A843",
    "14ct Gold": "#C9A84C",
    "18ct Gold": "#B8941F",
    Platinum: "#C0C0C0",
    Silver: "#A8A8A8",
    "Rose Gold": "#D4957A",
  };
  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl text-warm mb-2 text-center">
        Choose your metal
      </h3>
      <p className="font-body text-muted text-sm text-center mb-8">
        Each metal has its own character and warmth.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((o) => (
          <SelectionCard key={o} label={o} value={o} selected={value === o} onSelect={onChange}>
            <div
              className="w-8 h-8 rounded-full border border-white/20"
              style={{ backgroundColor: colours[o] }}
            />
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}

function StepStone({
  value,
  onChange,
}: {
  value: Stone | null;
  onChange: (v: Stone) => void;
}) {
  const options: Stone[] = ["Diamond", "Ruby", "Sapphire", "Emerald", "Pearl", "None", "Other"];
  const colours: Record<Stone, string> = {
    Diamond: "#E8E8F0",
    Ruby: "#9B111E",
    Sapphire: "#0F52BA",
    Emerald: "#046307",
    Pearl: "#F0EAD6",
    None: "transparent",
    Other: "transparent",
  };
  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl text-warm mb-2 text-center">
        Any gemstones?
      </h3>
      <p className="font-body text-muted text-sm text-center mb-8">
        Pick a stone, or skip this step if you want something without.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((o) => (
          <SelectionCard key={o} label={o} value={o} selected={value === o} onSelect={onChange}>
            {colours[o] !== "transparent" ? (
              <div
                className="w-8 h-8 rounded-full border border-white/20"
                style={{ backgroundColor: colours[o] }}
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center text-gold">
                {o === "None" ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="4" y1="4" x2="20" y2="20" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.5 9a3 3 0 0 1 5 1c0 2-3 2.5-3 5" />
                    <circle cx="12" cy="18" r=".5" fill="currentColor" />
                  </svg>
                )}
              </div>
            )}
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}

function StepBudget({
  value,
  onChange,
}: {
  value: Budget | null;
  onChange: (v: Budget) => void;
}) {
  const options: Budget[] = [
    "Under £500",
    "£500 - £1,000",
    "£1,000 - £2,500",
    "£2,500 - £5,000",
    "£5,000+",
    "Not sure yet",
  ];
  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl text-warm mb-2 text-center">
        What's your budget?
      </h3>
      <p className="font-body text-muted text-sm text-center mb-8">
        Just a rough guide so Michael can shape ideas to match. No pressure.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((o) => (
          <SelectionCard key={o} label={o} value={o} selected={value === o} onSelect={onChange}>
            <span className="text-gold text-lg font-display">£</span>
          </SelectionCard>
        ))}
      </div>
    </div>
  );
}

function StepInspiration({
  text,
  onTextChange,
  fileName,
  onFileChange,
}: {
  text: string;
  onTextChange: (v: string) => void;
  fileName: string;
  onFileChange: (name: string) => void;
}) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) onFileChange(file.name);
    },
    [onFileChange],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileChange(file.name);
    },
    [onFileChange],
  );

  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl text-warm mb-2 text-center">
        Tell us more
      </h3>
      <p className="font-body text-muted text-sm text-center mb-8">
        Describe your vision. Is it for an occasion? Any details that help Michael understand
        what you're after.
      </p>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        rows={5}
        placeholder="E.g. I'm looking for an engagement ring with a vintage feel, something with a sapphire centre stone and small diamonds around it..."
        className="w-full bg-navy-card border border-gold/20 rounded-sm p-4 font-body text-warm text-sm placeholder:text-muted/50 focus:border-gold/60 focus:outline-none resize-none transition-colors"
      />
      <div className="mt-6">
        <p className="font-body text-muted text-xs mb-2">
          Got a photo or sketch for inspiration? Drop it here (optional).
        </p>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gold/20 rounded-sm p-8 text-center hover:border-gold/40 transition-colors cursor-pointer"
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          {fileName ? (
            <p className="font-body text-gold text-sm">{fileName}</p>
          ) : (
            <p className="font-body text-muted text-sm">
              Drag and drop an image, or click to browse
            </p>
          )}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      </div>
    </div>
  );
}

function StepSummary({ data }: { data: FormData }) {
  const rows = [
    { label: "Piece", value: data.pieceType },
    { label: "Metal", value: data.metal },
    { label: "Stone", value: data.stone },
    { label: "Budget", value: data.budget },
    { label: "Notes", value: data.inspiration || "None" },
    { label: "Image", value: data.fileName || "None" },
  ];

  const waText = [
    `Hi Michael, I'd love to commission a bespoke piece.`,
    ``,
    `Piece: ${data.pieceType}`,
    `Metal: ${data.metal}`,
    `Stone: ${data.stone}`,
    `Budget: ${data.budget}`,
    data.inspiration ? `\nNotes: ${data.inspiration}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`;

  return (
    <div>
      <h3 className="font-display text-2xl md:text-3xl text-warm mb-2 text-center">
        Your commission summary
      </h3>
      <p className="font-body text-muted text-sm text-center mb-8">
        Everything look right? Hit the button to send this straight to Michael on WhatsApp.
      </p>
      <div className="bg-navy-card border border-gold/20 rounded-sm p-6 mb-8 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between items-start">
            <span className="font-body text-xs uppercase tracking-luxe text-gold">{r.label}</span>
            <span className="font-body text-sm text-warm text-right max-w-[60%]">{r.value}</span>
          </div>
        ))}
      </div>
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-gold text-white px-8 py-3.5 font-body text-[11px] uppercase tracking-elegant hover:bg-gold-muted transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        SEND TO MICHAEL ON WHATSAPP
      </a>
    </div>
  );
}

/* ── Progress Bar ── */

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-2">
        <span className="font-body text-xs uppercase tracking-luxe text-gold">
          Step {step} of {TOTAL_STEPS}
        </span>
      </div>
      <div className="h-[2px] bg-gold/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gold"
          initial={false}
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

/* ── Slide Variants ── */

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
  }),
};

/* ── Main Component ── */

export default function CommissionVisualiser() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<FormData>({
    pieceType: null,
    metal: null,
    stone: null,
    budget: null,
    inspiration: "",
    fileName: "",
  });

  const canAdvance = (): boolean => {
    switch (step) {
      case 1:
        return data.pieceType !== null;
      case 2:
        return data.metal !== null;
      case 3:
        return data.stone !== null;
      case 4:
        return data.budget !== null;
      case 5:
        return true; // inspiration is optional
      case 6:
        return true;
      default:
        return false;
    }
  };

  const next = async () => {
    if (!canAdvance()) return;
    if (step === 5) {
      // Save to Supabase before showing summary
      setSaving(true);
      try {
        await supabase.from("v2_enquiries").insert({
          type: "bespoke",
          name: "",
          whatsapp: "",
          message: JSON.stringify({
            pieceType: data.pieceType,
            metal: data.metal,
            stone: data.stone,
            budget: data.budget,
            inspiration: data.inspiration,
          }),
          metadata: { source: "commission-visualiser" },
        });
        setSaved(true);
      } catch {
        // Don't block the user if Supabase fails
      }
      setSaving(false);
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar step={step} />

      <div className="relative overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {step === 1 && (
              <StepPieceType
                value={data.pieceType}
                onChange={(v) => setData((d) => ({ ...d, pieceType: v }))}
              />
            )}
            {step === 2 && (
              <StepMetal
                value={data.metal}
                onChange={(v) => setData((d) => ({ ...d, metal: v }))}
              />
            )}
            {step === 3 && (
              <StepStone
                value={data.stone}
                onChange={(v) => setData((d) => ({ ...d, stone: v }))}
              />
            )}
            {step === 4 && (
              <StepBudget
                value={data.budget}
                onChange={(v) => setData((d) => ({ ...d, budget: v }))}
              />
            )}
            {step === 5 && (
              <StepInspiration
                text={data.inspiration}
                onTextChange={(v) => setData((d) => ({ ...d, inspiration: v }))}
                fileName={data.fileName}
                onFileChange={(name) => setData((d) => ({ ...d, fileName: name }))}
              />
            )}
            {step === 6 && <StepSummary data={data} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      {step < TOTAL_STEPS && (
        <div className="flex justify-between mt-10">
          <button
            type="button"
            onClick={back}
            disabled={step === 1}
            className={`font-body text-[11px] uppercase tracking-elegant px-6 py-3 border border-gold/30 text-gold transition-colors ${
              step === 1
                ? "opacity-30 cursor-not-allowed"
                : "hover:bg-gold/10 cursor-pointer"
            }`}
          >
            Back
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!canAdvance() || saving}
            className={`font-body text-[11px] uppercase tracking-elegant px-8 py-3 bg-gold text-white transition-colors ${
              canAdvance() && !saving
                ? "hover:bg-gold-muted cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            {saving ? "Saving..." : step === 5 ? "See Summary" : "Next"}
          </button>
        </div>
      )}

      {/* Back button on summary */}
      {step === TOTAL_STEPS && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={back}
            className="font-body text-[11px] uppercase tracking-elegant text-gold hover:text-gold-muted transition-colors cursor-pointer"
          >
            ← Go back and edit
          </button>
          {saved && (
            <p className="font-body text-xs text-muted mt-3">
              Your selections have been saved. Michael will be ready for your message.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

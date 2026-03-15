import useSEO from "../hooks/useSEO";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";
import CommissionVisualiser from "../components/CommissionVisualiser";

/* ── Example commissions (placeholder data) ── */

const EXAMPLES = [
  {
    title: "Sapphire Halo Engagement Ring",
    description:
      "A 1.2ct oval sapphire surrounded by a halo of brilliant-cut diamonds, set in 18ct white gold. Designed for a surprise proposal in Gibraltar.",
  },
  {
    title: "Gold Family Crest Signet",
    description:
      "Hand-engraved 9ct gold signet ring featuring a family coat of arms. Three generations of heritage captured in one piece.",
  },
  {
    title: "Pearl & Diamond Drop Earrings",
    description:
      "South Sea pearls suspended from a diamond-set drop in 18ct yellow gold. Created as a 25th anniversary gift.",
  },
  {
    title: "Emerald Art Deco Pendant",
    description:
      "A Colombian emerald in a geometric Art Deco setting, surrounded by step-cut diamonds on a platinum chain.",
  },
  {
    title: "Rose Gold Wedding Band Set",
    description:
      "Matching his-and-hers bands in brushed rose gold with a polished inner edge. Simple, timeless, personal.",
  },
  {
    title: "Redesigned Heirloom Bracelet",
    description:
      "A grandmother's tennis bracelet stripped down and rebuilt into a modern cuff, keeping every original stone.",
  },
];

export default function Bespoke() {
  useSEO({
    title: "Bespoke Commissions | The Jewellery Studio",
    description: "Design your dream piece with Michael. From engagement rings to one-of-a-kind creations, handcrafted in Gibraltar.",
    url: "/bespoke",
  });

  return (
    <div className="bg-navy min-h-screen pt-32 pb-20">
      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 md:mb-24">
        <SectionReveal>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            BESPOKE COMMISSIONS
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-warm mb-4">
            Your Vision, His Hands
          </h1>
          <GoldDivider className="mb-8" />
        </SectionReveal>
        <SectionReveal delay={0.15}>
          <p className="font-body text-muted leading-relaxed mb-5 max-w-2xl mx-auto">
            Michael has spent 38 years turning ideas into wearable art. Every bespoke piece
            starts with a conversation and ends with something completely yours, crafted by
            hand in his Gibraltar workshop.
          </p>
          <p className="font-body text-muted leading-relaxed max-w-2xl mx-auto">
            Whether you've got a sketch on a napkin or a picture saved on your phone, he'll
            work with you through every detail. Metal, stone, setting, finish. Nothing is
            decided without you.
          </p>
        </SectionReveal>
      </div>

      <GoldDivider width={100} className="mb-16 md:mb-24" />

      {/* ── Commission Visualiser ── */}
      <div className="max-w-4xl mx-auto px-6 mb-16 md:mb-24">
        <SectionReveal>
          <div className="text-center mb-12">
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
              DESIGN YOUR PIECE
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-warm mb-3">
              Commission Builder
            </h2>
            <p className="font-body text-muted text-sm max-w-lg mx-auto">
              Walk through a few quick choices and we'll put together a brief for Michael.
              Takes about a minute.
            </p>
          </div>
        </SectionReveal>
        <SectionReveal delay={0.1}>
          <CommissionVisualiser />
        </SectionReveal>
      </div>

      <GoldDivider width={100} className="mb-16 md:mb-24" />

      {/* ── Previous Commissions Gallery (hidden until real images are available) ── */}
      {false && (
      <div className="max-w-6xl mx-auto px-6">
        <SectionReveal>
          <div className="text-center mb-12">
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
              PREVIOUS WORK
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-warm mb-3">
              Pieces Michael Has Created
            </h2>
            <p className="font-body text-muted text-sm max-w-lg mx-auto">
              Every commission is unique. Here are a few examples of what's been crafted
              over the years.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAMPLES.map((piece, i) => (
            <SectionReveal key={piece.title} delay={i * 0.08}>
              <div className="bg-navy-card border border-gold/20 rounded-sm overflow-hidden group">
                {/* Placeholder image */}
                <div className="aspect-square bg-navy-deep flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gold/30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-warm mb-2">{piece.title}</h3>
                  <p className="font-body text-muted text-sm leading-relaxed">
                    {piece.description}
                  </p>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import useSEO from "../hooks/useSEO";
import GoldDivider from "../components/GoldDivider";
import SectionReveal from "../components/SectionReveal";

/* ─── Cut Section: SVG diamond with animated light rays ─── */

function CutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const ray1Y = useTransform(scrollYProgress, [0.1, 0.5], ["-30%", "20%"]);
  const ray2Y = useTransform(scrollYProgress, [0.15, 0.55], ["-25%", "25%"]);
  const ray3Y = useTransform(scrollYProgress, [0.2, 0.6], ["-35%", "15%"]);
  const raysOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-navy-deep relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <SectionReveal>
          <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
            The 4Cs of Diamonds
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-warm mb-4">
            Cut
          </h2>
          <GoldDivider className="mb-8" />
          <p className="font-body text-muted leading-relaxed max-w-xl mx-auto mb-12">
            Cut is what gives a diamond its sparkle. It's not about the shape,
            it's about how well the facets interact with light. A well-cut
            diamond bounces light from one facet to another, then fires it
            back through the top. Get the cut wrong and even the biggest
            diamond looks dull.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="relative w-64 h-72 mx-auto">
            {/* Diamond shape */}
            <svg
              viewBox="0 0 200 220"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Diamond outline */}
              <polygon
                points="100,10 180,80 100,210 20,80"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.5"
                opacity="0.6"
              />
              {/* Top facets */}
              <line x1="100" y1="10" x2="60" y2="80" stroke="#C9A84C" strokeWidth="0.8" opacity="0.3" />
              <line x1="100" y1="10" x2="140" y2="80" stroke="#C9A84C" strokeWidth="0.8" opacity="0.3" />
              <line x1="20" y1="80" x2="180" y2="80" stroke="#C9A84C" strokeWidth="0.8" opacity="0.3" />
              {/* Internal facets */}
              <line x1="60" y1="80" x2="100" y2="210" stroke="#C9A84C" strokeWidth="0.5" opacity="0.2" />
              <line x1="140" y1="80" x2="100" y2="210" stroke="#C9A84C" strokeWidth="0.5" opacity="0.2" />
              <line x1="100" y1="80" x2="100" y2="210" stroke="#C9A84C" strokeWidth="0.5" opacity="0.15" />
            </svg>

            {/* Animated light rays */}
            <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: raysOpacity }}>
              {/* Incoming ray left */}
              <motion.svg
                className="absolute top-0 left-0 w-full h-full"
                viewBox="0 0 200 220"
                style={{ y: ray1Y }}
              >
                <line x1="30" y1="0" x2="80" y2="75" stroke="#C9A84C" strokeWidth="2" opacity="0.7">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                </line>
                {/* Reflected ray */}
                <line x1="80" y1="75" x2="120" y2="140" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" repeatCount="indefinite" />
                </line>
                <line x1="120" y1="140" x2="100" y2="60" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2s" repeatCount="indefinite" />
                </line>
              </motion.svg>

              {/* Incoming ray center */}
              <motion.svg
                className="absolute top-0 left-0 w-full h-full"
                viewBox="0 0 200 220"
                style={{ y: ray2Y }}
              >
                <line x1="100" y1="0" x2="100" y2="75" stroke="#C9A84C" strokeWidth="2" opacity="0.8">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="1.8s" repeatCount="indefinite" />
                </line>
                <line x1="100" y1="75" x2="70" y2="130" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.2s" repeatCount="indefinite" />
                </line>
                <line x1="70" y1="130" x2="90" y2="50" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
                </line>
              </motion.svg>

              {/* Incoming ray right */}
              <motion.svg
                className="absolute top-0 left-0 w-full h-full"
                viewBox="0 0 200 220"
                style={{ y: ray3Y }}
              >
                <line x1="170" y1="0" x2="130" y2="75" stroke="#C9A84C" strokeWidth="2" opacity="0.7">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.3s" repeatCount="indefinite" />
                </line>
                <line x1="130" y1="75" x2="90" y2="150" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur="2s" repeatCount="indefinite" />
                </line>
                <line x1="90" y1="150" x2="110" y2="55" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.4s" repeatCount="indefinite" />
                </line>
              </motion.svg>
            </motion.div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ─── Colour Section: D-Z scale with scroll-driven highlight ─── */

const COLOUR_GRADES = [
  { grade: "D", label: "Colourless", color: "#FFFFFF" },
  { grade: "E", label: "", color: "#FEFEF8" },
  { grade: "F", label: "", color: "#FDFDF0" },
  { grade: "G", label: "Near Colourless", color: "#FCFBE8" },
  { grade: "H", label: "", color: "#FBF8E0" },
  { grade: "I", label: "", color: "#FAF5D8" },
  { grade: "J", label: "", color: "#F9F2D0" },
  { grade: "K", label: "Faint", color: "#F5EDC0" },
  { grade: "L", label: "", color: "#F1E8B5" },
  { grade: "M", label: "", color: "#EDE3AA" },
  { grade: "N", label: "Very Light", color: "#E5D990" },
  { grade: "O", label: "", color: "#E0D388" },
  { grade: "P", label: "", color: "#DBCD80" },
  { grade: "Q", label: "", color: "#D6C778" },
  { grade: "R", label: "", color: "#D1C170" },
  { grade: "S", label: "Light", color: "#CCB868" },
  { grade: "T", label: "", color: "#C7B260" },
  { grade: "U", label: "", color: "#C2AC58" },
  { grade: "V", label: "", color: "#BDA650" },
  { grade: "W", label: "", color: "#B8A048" },
  { grade: "X", label: "", color: "#B39A40" },
  { grade: "Y", label: "", color: "#AE9438" },
  { grade: "Z", label: "Light Yellow", color: "#A98E30" },
];

function ColourSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const highlightIndex = useTransform(
    scrollYProgress,
    [0.2, 0.8],
    [0, COLOUR_GRADES.length - 1]
  );

  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const unsub = highlightIndex.on("change", (v) => setActiveIdx(Math.round(v)));
    return unsub;
  }, [highlightIndex]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center bg-navy relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <SectionReveal>
          <h2 className="font-display text-4xl md:text-6xl text-warm mb-4">
            Colour
          </h2>
          <GoldDivider className="mb-8" />
          <p className="font-body text-muted leading-relaxed max-w-xl mx-auto mb-12">
            Most diamonds look white, but they actually sit on a scale from
            completely colourless (D) to light yellow (Z). The less colour,
            the rarer the stone. Grades D through F are considered colourless
            and command the highest prices. But honestly, anything in the
            G to J range looks stunning to the naked eye.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="flex items-end justify-center gap-[2px] md:gap-1 overflow-x-auto pb-4">
            {COLOUR_GRADES.map((item, i) => {
              const isActive = i === activeIdx;
              return (
                <div key={item.grade} className="flex flex-col items-center">
                  <motion.div
                    className="rounded-sm transition-all duration-200"
                    style={{
                      backgroundColor: item.color,
                      width: isActive ? 28 : 16,
                      height: isActive ? 64 : 40,
                    }}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      boxShadow: isActive
                        ? "0 0 20px rgba(201, 168, 76, 0.5)"
                        : "0 0 0px rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.2 }}
                  />
                  <span
                    className={`font-body text-[10px] mt-2 transition-colors duration-200 ${
                      isActive ? "text-gold" : "text-muted"
                    }`}
                  >
                    {item.grade}
                  </span>
                  {item.label && (
                    <span className="font-body text-[8px] text-muted/50 max-w-[40px] leading-tight">
                      {item.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <motion.p
            className="font-body text-gold text-sm mt-6 h-6"
            key={activeIdx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            Grade {COLOUR_GRADES[activeIdx]?.grade}
            {COLOUR_GRADES[activeIdx]?.label
              ? ` \u2013 ${COLOUR_GRADES[activeIdx].label}`
              : ""}
          </motion.p>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ─── Clarity Section: Magnifying glass with inclusions ─── */

const CLARITY_GRADES = [
  { grade: "FL", label: "Flawless", inclusions: 0 },
  { grade: "IF", label: "Internally Flawless", inclusions: 0 },
  { grade: "VVS1", label: "Very Very Slightly Included", inclusions: 2 },
  { grade: "VVS2", label: "Very Very Slightly Included", inclusions: 3 },
  { grade: "VS1", label: "Very Slightly Included", inclusions: 5 },
  { grade: "VS2", label: "Very Slightly Included", inclusions: 7 },
  { grade: "SI1", label: "Slightly Included", inclusions: 10 },
  { grade: "SI2", label: "Slightly Included", inclusions: 14 },
  { grade: "I1", label: "Included", inclusions: 18 },
  { grade: "I2", label: "Included", inclusions: 24 },
  { grade: "I3", label: "Included", inclusions: 30 },
];

// Deterministic "random" positions for inclusions based on index
function getInclusionPositions(count: number): Array<{ x: number; y: number; size: number }> {
  const positions: Array<{ x: number; y: number; size: number }> = [];
  for (let i = 0; i < count; i++) {
    const angle = (i * 137.5 * Math.PI) / 180; // golden angle for nice distribution
    const radius = 15 + (i * 3.7) % 30;
    positions.push({
      x: 50 + Math.cos(angle) * radius,
      y: 50 + Math.sin(angle) * radius,
      size: 1 + (i % 3) * 0.8,
    });
  }
  return positions;
}

function ClaritySection() {
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const diamondRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!diamondRef.current) return;
      const rect = diamondRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) });
    },
    []
  );

  const grade = CLARITY_GRADES[selectedGrade];
  const inclusions = getInclusionPositions(grade.inclusions);

  return (
    <section className="min-h-screen flex items-center justify-center bg-navy-deep relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <SectionReveal>
          <h2 className="font-display text-4xl md:text-6xl text-warm mb-4">
            Clarity
          </h2>
          <GoldDivider className="mb-8" />
          <p className="font-body text-muted leading-relaxed max-w-xl mx-auto mb-12">
            Clarity measures how clean a diamond is from tiny natural
            imperfections called inclusions. Almost every diamond has them,
            they formed under intense heat and pressure deep in the earth.
            The question is whether you can see them. Move your cursor over
            the diamond below and tap different grades to see the difference.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          {/* Grade selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CLARITY_GRADES.map((g, i) => (
              <button
                key={g.grade}
                onClick={() => setSelectedGrade(i)}
                className={`font-body text-[11px] uppercase tracking-elegant px-3 py-1.5 border transition-colors duration-200 ${
                  i === selectedGrade
                    ? "border-gold text-gold bg-gold/10"
                    : "border-muted/20 text-muted hover:border-gold/50 hover:text-gold/70"
                }`}
              >
                {g.grade}
              </button>
            ))}
          </div>

          {/* Diamond with magnifying glass */}
          <div
            ref={diamondRef}
            className="relative w-64 h-64 mx-auto cursor-none select-none"
            onMouseMove={handleMouseMove}
          >
            {/* Diamond surface (base layer) */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50,5 95,40 50,95 5,40"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="0.8"
                opacity="0.4"
              />
              <line x1="50" y1="5" x2="30" y2="40" stroke="#C9A84C" strokeWidth="0.4" opacity="0.2" />
              <line x1="50" y1="5" x2="70" y2="40" stroke="#C9A84C" strokeWidth="0.4" opacity="0.2" />
              <line x1="5" y1="40" x2="95" y2="40" stroke="#C9A84C" strokeWidth="0.4" opacity="0.2" />

              {/* Inclusions (small imperfections) */}
              {inclusions.map((inc, i) => (
                <circle
                  key={i}
                  cx={inc.x}
                  cy={inc.y}
                  r={inc.size * 0.6}
                  fill="rgba(255,255,255,0.15)"
                />
              ))}
            </svg>

            {/* Magnifying glass overlay that reveals inclusions clearly */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${mousePos.x}%`,
                top: `${mousePos.y}%`,
                transform: "translate(-50%, -50%)",
                width: 90,
                height: 90,
              }}
            >
              {/* Magnified view */}
              <div
                className="w-full h-full rounded-full border-2 border-gold/60 overflow-hidden relative"
                style={{
                  background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, rgba(27,42,63,0.3) 100%)",
                  boxShadow: "0 0 20px rgba(201,168,76,0.2), inset 0 0 15px rgba(201,168,76,0.05)",
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {inclusions.map((inc, i) => {
                    // Position inclusions relative to the lens center
                    const relX = (inc.x - mousePos.x) * 2.5 + 50;
                    const relY = (inc.y - mousePos.y) * 2.5 + 50;
                    if (relX < 0 || relX > 100 || relY < 0 || relY > 100) return null;
                    return (
                      <circle
                        key={i}
                        cx={relX}
                        cy={relY}
                        r={inc.size * 2}
                        fill="rgba(255,255,255,0.5)"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="0.5"
                      />
                    );
                  })}
                </svg>
              </div>
              {/* Lens handle hint */}
              <div className="absolute -bottom-1 -right-1 w-3 h-6 rounded-full bg-gold/30 rotate-45" />
            </div>
          </div>

          <p className="font-body text-gold text-sm mt-6">
            {grade.grade} &middot; {grade.label}
          </p>
          <p className="font-body text-muted/60 text-xs mt-1">
            {grade.inclusions === 0
              ? "No visible inclusions"
              : `${grade.inclusions} inclusions visible under magnification`}
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ─── Carat Section: Size comparison on hand silhouette ─── */

const CARAT_SIZES = [
  { carat: 0.5, diameter: 5.1, display: "0.5ct" },
  { carat: 1.0, diameter: 6.5, display: "1ct" },
  { carat: 1.5, diameter: 7.4, display: "1.5ct" },
  { carat: 2.0, diameter: 8.2, display: "2ct" },
  { carat: 3.0, diameter: 9.4, display: "3ct" },
];

function CaratSection() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-navy relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <SectionReveal>
          <h2 className="font-display text-4xl md:text-6xl text-warm mb-4">
            Carat
          </h2>
          <GoldDivider className="mb-8" />
          <p className="font-body text-muted leading-relaxed max-w-xl mx-auto mb-12">
            Carat is the weight of a diamond, not the size. One carat equals
            0.2 grams. But bigger isn't always better. A well-cut 1 carat
            diamond can look more impressive than a poorly cut 1.5 carat
            stone. It's about the whole package.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="relative max-w-lg mx-auto">
            {/* Hand silhouette */}
            <svg
              viewBox="0 0 300 360"
              className="w-full max-w-sm mx-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Simplified hand/ring finger outline */}
              <path
                d="M120,340 L120,180 Q120,140 135,120 Q145,105 150,80 Q155,60 150,40 Q148,30 150,20 L150,18 Q152,12 155,18 L155,20 Q158,35 156,50 Q154,65 155,80 Q156,105 165,120 Q180,140 180,180 L180,340"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1"
                opacity="0.3"
              />
              {/* Ring finger ring band */}
              <ellipse
                cx="150"
                cy="175"
                rx="32"
                ry="8"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="1.5"
                opacity="0.5"
              />

              {/* Diamond size comparisons */}
              {CARAT_SIZES.map((stone, i) => {
                const scale = stone.diameter / 9.4; // Normalize to largest
                const r = 8 + scale * 14;
                const x = 40 + i * 55;
                const y = 280;

                return (
                  <g key={stone.display}>
                    {/* Diamond shape (top-down view, round brilliant) */}
                    <circle
                      cx={x}
                      cy={y}
                      r={r}
                      fill="none"
                      stroke="#C9A84C"
                      strokeWidth="1"
                      opacity="0.7"
                    />
                    {/* Facet lines */}
                    {[0, 45, 90, 135].map((angle) => (
                      <line
                        key={angle}
                        x1={x + Math.cos((angle * Math.PI) / 180) * r}
                        y1={y + Math.sin((angle * Math.PI) / 180) * r}
                        x2={x + Math.cos(((angle + 180) * Math.PI) / 180) * r}
                        y2={y + Math.sin(((angle + 180) * Math.PI) / 180) * r}
                        stroke="#C9A84C"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    ))}
                    {/* Inner circle (table facet) */}
                    <circle
                      cx={x}
                      cy={y}
                      r={r * 0.5}
                      fill="rgba(201,168,76,0.08)"
                      stroke="#C9A84C"
                      strokeWidth="0.5"
                      opacity="0.4"
                    />
                    {/* Label */}
                    <text
                      x={x}
                      y={y + r + 16}
                      textAnchor="middle"
                      fill="#C9A84C"
                      fontSize="11"
                      fontFamily="Jost, sans-serif"
                    >
                      {stone.display}
                    </text>
                    <text
                      x={x}
                      y={y + r + 28}
                      textAnchor="middle"
                      fill="rgba(200,200,200,0.4)"
                      fontSize="8"
                      fontFamily="Jost, sans-serif"
                    >
                      {stone.diameter}mm
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */

export default function DiamondGrader() {
  useSEO({
    title: "Diamond Grader | The Jewellery Studio",
    description: "Learn about the 4Cs of diamonds: Cut, Colour, Clarity, and Carat. Interactive visual guide to diamond quality.",
    url: "/diamond-grader",
  });

  return (
    <div className="bg-navy">
      {/* Hero intro */}
      <section className="min-h-[60vh] flex items-center justify-center bg-navy-deep pt-[120px] pb-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <SectionReveal>
            <p className="font-body text-[11px] uppercase tracking-luxe text-gold mb-4">
              Education
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-warm mb-4">
              The 4Cs of Diamonds
            </h1>
            <GoldDivider className="mb-8" />
            <p className="font-body text-muted leading-relaxed max-w-lg mx-auto">
              Understanding diamonds doesn't need to be complicated. These
              four characteristics determine every diamond's quality, beauty,
              and value. Scroll down and we'll walk you through each one.
            </p>
          </SectionReveal>
        </div>
      </section>

      <CutSection />
      <GoldDivider width={100} className="py-12" />
      <ColourSection />
      <GoldDivider width={100} className="py-12" />
      <ClaritySection />
      <GoldDivider width={100} className="py-12" />
      <CaratSection />

      {/* Final CTA */}
      <section className="min-h-[50vh] flex items-center justify-center bg-navy-deep py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <SectionReveal>
            <h2 className="font-display text-4xl md:text-5xl text-warm mb-4">
              Find Your Perfect Diamond
            </h2>
            <GoldDivider className="mb-8" />
            <p className="font-body text-muted leading-relaxed mb-10">
              Michael has 38 years of experience helping people find the
              right diamond. Whether you're choosing an engagement ring or
              investing in a stone, he'll guide you through every detail.
            </p>
            <a
              href="https://wa.me/35054013690?text=Hi%20Michael%2C%20I%27d%20like%20to%20discuss%20diamonds."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-white px-8 py-3.5 font-body text-[11px] uppercase tracking-elegant hover:bg-gold-muted transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Discuss Diamonds with Michael
            </a>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}

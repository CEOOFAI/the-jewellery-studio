import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "fade-up" | "fade-left" | "fade-right" | "scale-up";

interface SectionRevealProps {
  variant?: Variant;
  delay?: number;
  className?: string;
  children: ReactNode;
}

const variants: Record<
  Variant,
  { initial: Record<string, number>; whileInView: Record<string, number> }
> = {
  "fade-up": {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
  },
  "fade-left": {
    initial: { opacity: 0, x: -60 },
    whileInView: { opacity: 1, x: 0 },
  },
  "fade-right": {
    initial: { opacity: 0, x: 60 },
    whileInView: { opacity: 1, x: 0 },
  },
  "scale-up": {
    initial: { opacity: 0, scale: 0.92 },
    whileInView: { opacity: 1, scale: 1 },
  },
};

export default function SectionReveal({
  variant = "fade-up",
  delay = 0,
  className = "",
  children,
}: SectionRevealProps) {
  const v = variants[variant];

  return (
    <motion.div
      className={className}
      initial={v.initial}
      whileInView={v.whileInView}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

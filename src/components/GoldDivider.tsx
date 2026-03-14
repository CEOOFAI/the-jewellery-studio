import { motion } from "framer-motion";

interface GoldDividerProps {
  width?: number;
  className?: string;
}

export default function GoldDivider({
  width = 60,
  className = "",
}: GoldDividerProps) {
  return (
    <motion.div
      className={`mx-auto ${className}`}
      style={{ height: 1, backgroundColor: "#C9A84C" }}
      initial={{ width: 0 }}
      whileInView={{ width }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

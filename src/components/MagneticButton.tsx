import { useRef, useState, useEffect, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  useEffect(() => {
    setIsDesktop(window.matchMedia("(hover: hover)").matches);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDesktop || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 80;

    if (dist < maxDist) {
      const factor = (1 - dist / maxDist) * 8;
      const nx = (dx / (dist || 1)) * factor;
      const ny = (dy / (dist || 1)) * factor;
      x.set(nx);
      y.set(ny);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Internal route (starts with /) uses React Router Link
  const isInternal = href && href.startsWith("/");
  const isExternal = href && !isInternal;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ padding: isDesktop ? 80 : 0, margin: isDesktop ? -80 : 0, overflow: "visible", display: "inline-block" }}
    >
      <motion.div style={{ x: springX, y: springY }}>
        {isInternal ? (
          <Link
            to={href}
            className={`transition-colors duration-300 ${className}`}
            data-cursor="pointer"
          >
            {children}
          </Link>
        ) : isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-300 ${className}`}
            data-cursor="pointer"
          >
            {children}
          </a>
        ) : (
          <button
            type="button"
            onClick={onClick}
            className={`transition-colors duration-300 ${className}`}
            data-cursor="pointer"
          >
            {children}
          </button>
        )}
      </motion.div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

export default function GoldCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [expanded, setExpanded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const hover = window.matchMedia("(hover: hover)");
    if (!hover.matches) return;
    setIsDesktop(true);

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const isPointer =
        target.closest("[data-cursor='pointer']") !== null ||
        target.closest("a") !== null ||
        target.closest("button") !== null;
      setExpanded(isPointer);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const lerp = 0.15;
    const tick = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  if (!isDesktop) return null;

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 50,
        mixBlendMode: "difference",
        opacity: visible ? 1 : 0,
        width: expanded ? 32 : 8,
        height: expanded ? 32 : 8,
        borderRadius: "50%",
        backgroundColor: expanded ? "transparent" : "#C9A84C",
        border: expanded ? "1.5px solid #C9A84C" : "none",
        transition: "width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border 0.2s ease, opacity 0.15s ease",
        willChange: "transform",
      }}
    />
  );
}

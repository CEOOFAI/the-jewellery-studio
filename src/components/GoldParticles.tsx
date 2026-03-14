import { useEffect, useRef } from "react";

interface GoldParticlesProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  sineAmp: number;
  sineFreq: number;
  phase: number;
  baseX: number;
}

export default function GoldParticles({ className = "" }: GoldParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const particles: Particle[] = [];
    const count = 30;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const spawn = (yOverride?: number): Particle => {
      const x = Math.random() * w;
      return {
        x,
        y: yOverride !== undefined ? yOverride : Math.random() * h,
        r: 1 + Math.random(),
        opacity: 0.15 + Math.random() * 0.2,
        speed: 0.1 + Math.random() * 0.2,
        sineAmp: 10 + Math.random() * 20,
        sineFreq: 0.002 + Math.random() * 0.003,
        phase: Math.random() * Math.PI * 2,
        baseX: x,
      };
    };

    resize();
    for (let i = 0; i < count; i++) {
      particles.push(spawn());
    }

    let frame = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speed;
        p.x = p.baseX + Math.sin(frame * p.sineFreq + p.phase) * p.sineAmp;

        if (p.y < -10) {
          particles[i] = spawn(h + 10);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${p.opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement!);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

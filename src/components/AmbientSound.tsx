import { useState, useRef, useCallback } from "react";

export default function AmbientSound() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio("/audio/workshop-ambient.mp3");
      audio.loop = true;
      audio.volume = 0.15;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const toggle = () => {
    const audio = getAudio();

    if (playing) {
      audio.pause();
      localStorage.setItem("tjs-ambient-sound", "off");
      setPlaying(false);
    } else {
      audio.play().catch(() => {});
      localStorage.setItem("tjs-ambient-sound", "on");
      setPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-navy-card border border-gold/30 flex items-center justify-center hover:border-gold transition-colors duration-300"
      aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
      title={playing ? "Mute ambient sound" : "Play ambient sound"}
    >
      {playing ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}

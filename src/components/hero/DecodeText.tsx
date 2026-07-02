// src/components/hero/DecodeText.tsx
import { useEffect, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#@$%&01";

interface DecodeTextProps {
  text: string;
  /** ms before the decode starts */
  delay?: number;
}

/**
 * Hacker-style text reveal: each character cycles through random glyphs
 * before locking into place. Re-runs whenever `text` changes, so it can
 * also be used for cycling phrases.
 */
export function DecodeText({ text, delay = 0 }: DecodeTextProps) {
  const [display, setDisplay] = useState(() => "\u00a0".repeat(text.length));

  useEffect(() => {
    let raf = 0;
    let frame = 0;
    let cancelled = false;

    const queue = Array.from(text).map((char, i) => {
      const start = i * 1.4 + Math.random() * 4;
      return { char, start, end: start + 8 + Math.random() * 12 };
    });

    const tick = () => {
      if (cancelled) return;
      frame += 1;
      let out = "";
      let done = true;
      for (const item of queue) {
        if (frame >= item.end) {
          out += item.char;
        } else if (frame >= item.start) {
          done = false;
          out +=
            item.char === " "
              ? " "
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        } else {
          done = false;
          out += "\u00a0";
        }
      }
      setDisplay(out);
      if (!done) raf = requestAnimationFrame(tick);
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return <span>{display}</span>;
}

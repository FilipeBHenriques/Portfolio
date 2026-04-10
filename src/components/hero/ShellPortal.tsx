import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useLocation } from "react-router-dom";
import { RetroShell } from "./RetroShell";

function useHeroVisible() {
  const location = useLocation();
  const [intersecting, setIntersecting] = useState(true);

  useEffect(() => {
    if (location.pathname !== "/") {
      return;
    }

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { threshold: 0.35 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [location.pathname]);

  return location.pathname === "/" && intersecting;
}

export function ShellPortal() {
  const location = useLocation();
  const heroVisible = useHeroVisible();
  const shouldAutoOpen = location.pathname === "/" && heroVisible;
  const [isOpen, setIsOpen] = useState(shouldAutoOpen);
  const [heroRect, setHeroRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    setIsOpen(shouldAutoOpen);
  }, [shouldAutoOpen]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;

    const updateRect = () => {
      setHeroRect(hero.getBoundingClientRect());
    };

    updateRect();

    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(hero);
    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [location.pathname]);

  const shellAnchorStyle = useMemo<React.CSSProperties>(() => {
    if (shouldAutoOpen && heroRect) {
      return {
        position: "fixed",
        left: `${heroRect.right - 560}px`,
        top: `${heroRect.top + 72}px`,
        zIndex: 90,
        pointerEvents: "auto",
      };
    }

    return {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      zIndex: 90,
      pointerEvents: "auto",
    };
  }, [heroRect, shouldAutoOpen]);

  const launcherAnchorStyle = useMemo<React.CSSProperties>(() => {
    if (location.pathname === "/" && heroRect) {
      // Align with the bottom-right corner bracket in HeroBackground (right: 40px, bottom: 80px)
      return {
        position: "fixed",
        right: `${window.innerWidth - heroRect.right + 60}px`,
        top: `${heroRect.bottom - 90 - 36 - 8}px`,
        zIndex: 90,
        pointerEvents: "auto",
      };
    }

    return {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      zIndex: 90,
      pointerEvents: "auto",
    };
  }, [heroRect, location.pathname]);

  return (
    <div style={{ pointerEvents: "none" }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="shell"
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={shellAnchorStyle}
          >
            <RetroShell onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="launcher"
            type="button"
            initial={{ opacity: 0, scale: 0.84, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.84, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onClick={() => setIsOpen(true)}
            style={{
              ...launcherAnchorStyle,
              height: "36px",
              paddingInline: "14px",
              borderRadius: "6px",
              border: "1px solid rgba(var(--accent-rgb), 0.35)",
              background: "rgba(8,8,8,0.92)",
              boxShadow:
                "0 0 0 1px rgba(var(--accent-rgb), 0.06), 0 0 16px rgba(var(--accent-rgb), 0.14)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--accent)",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
            aria-label="Open terminal"
          >
            <Terminal size={14} strokeWidth={1.75} />
            <span style={{ color: "var(--text-muted)" }}>~/</span>
            <span>terminal</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TerminalSquare } from "lucide-react";
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
        zIndex: 60,
        pointerEvents: "auto",
      };
    }

    return {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      zIndex: 60,
      pointerEvents: "auto",
    };
  }, [heroRect, shouldAutoOpen]);

  const launcherAnchorStyle = useMemo<React.CSSProperties>(() => {
    if (location.pathname === "/" && heroRect) {
      return {
        position: "fixed",
        left: `${heroRect.right - 110}px`,
        top: `${heroRect.bottom - 150}px`,
        zIndex: 60,
        pointerEvents: "auto",
      };
    }

    return {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      zIndex: 60,
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
              width: "46px",
              height: "46px",
              borderRadius: "14px",
              border: "1px solid rgba(var(--accent-rgb), 0.16)",
              background:
                "linear-gradient(180deg, rgba(var(--accent-rgb), 0.1), rgba(8,8,8,0.98))",
              boxShadow:
                "0 0 18px rgba(0,0,0,0.4), 0 0 10px rgba(var(--accent-rgb), 0.08)",
              display: "grid",
              placeItems: "center",
              color: "var(--accent)",
              cursor: "pointer",
            }}
            aria-label="Open terminal"
          >
            <TerminalSquare size={18} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

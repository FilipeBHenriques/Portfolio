import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Design tokens ─────────────────────────────────────────────────────────────
const ACCENT = '#39ff14';
const BG_BASE = '#080808';
const BG_SURFACE = '#111111';
const TEXT_PRIMARY = '#f0f0f0';
const TEXT_MUTED = '#666666';
const BORDER = '#222222';
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

// ─── Game constants ────────────────────────────────────────────────────────────
const CELL = 20;
const TICK_MS = 120;
const HI_KEY = 'snake_hi';

// ─── Types ─────────────────────────────────────────────────────────────────────
type Dir = 'R' | 'L' | 'U' | 'D';
type Point = { x: number; y: number };
type Phase = 'start' | 'playing' | 'dead';

interface GameState {
  snake: Point[];
  dir: Dir;
  nextDir: Dir;
  food: Point;
  score: number;
  phase: Phase;
  cols: number;
  rows: number;
}

// ─── Pure helpers ──────────────────────────────────────────────────────────────
function pad3(n: number): string {
  return String(n).padStart(3, '0');
}

function randomFood(snake: Point[], cols: number, rows: number): Point {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const free: Point[] = [];
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) return snake[0];
  return free[Math.floor(Math.random() * free.length)];
}

function buildInitialState(cols: number, rows: number): GameState {
  const cx = Math.floor(cols / 2);
  const cy = Math.floor(rows / 2);
  const snake: Point[] = [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ];
  return {
    snake,
    dir: 'R',
    nextDir: 'R',
    food: randomFood(snake, cols, rows),
    score: 0,
    phase: 'start',
    cols,
    rows,
  };
}

function opposite(d: Dir): Dir {
  if (d === 'R') return 'L';
  if (d === 'L') return 'R';
  if (d === 'U') return 'D';
  return 'U';
}

function keyToDir(key: string): Dir | null {
  switch (key) {
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'R';
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'L';
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'U';
    case 'ArrowDown':
    case 's':
    case 'S':
      return 'D';
    default:
      return null;
  }
}

function tickState(state: GameState): GameState {
  const { snake, nextDir, food, score, cols, rows } = state;
  const dir = nextDir;
  const head = snake[0];

  let nx = head.x;
  let ny = head.y;
  if (dir === 'R') nx++;
  else if (dir === 'L') nx--;
  else if (dir === 'U') ny--;
  else ny++;

  // Border collision → death
  if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
    return { ...state, dir, phase: 'dead' };
  }

  const newHead: Point = { x: nx, y: ny };

  // Self collision (exclude tail because it will vacate)
  const collidesBody = snake
    .slice(0, snake.length - 1)
    .some((p) => p.x === nx && p.y === ny);
  if (collidesBody) {
    return { ...state, dir, phase: 'dead' };
  }

  const ate = nx === food.x && ny === food.y;
  const newSnake = ate
    ? [newHead, ...snake]
    : [newHead, ...snake.slice(0, snake.length - 1)];
  const newScore = ate ? score + 1 : score;
  const newFood = ate ? randomFood(newSnake, cols, rows) : food;

  return {
    ...state,
    snake: newSnake,
    dir,
    food: newFood,
    score: newScore,
  };
}

// ─── Canvas draw ───────────────────────────────────────────────────────────────
function drawFrame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  w: number,
  h: number,
  hiScore: number,
) {
  const { snake, food, score, cols, rows } = state;

  // Background
  ctx.fillStyle = BG_BASE;
  ctx.fillRect(0, 0, w, h);

  // Faint grid
  ctx.strokeStyle = 'rgba(57,255,20,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL, 0);
    ctx.lineTo(x * CELL, rows * CELL);
    ctx.stroke();
  }
  for (let y = 0; y <= rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL);
    ctx.lineTo(cols * CELL, y * CELL);
    ctx.stroke();
  }

  // Food — glowing accent square
  ctx.save();
  ctx.shadowColor = ACCENT;
  ctx.shadowBlur = 12;
  ctx.fillStyle = ACCENT;
  ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
  ctx.restore();

  // Snake body
  for (let i = snake.length - 1; i >= 1; i--) {
    const p = snake[i];
    const alpha = Math.max(0.3, 0.9 - i * 0.012);
    ctx.fillStyle = `rgba(57,255,20,${alpha.toFixed(3)})`;
    ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2);
  }

  // Snake head — bright white-green with glow
  if (snake.length > 0) {
    const h0 = snake[0];
    ctx.save();
    ctx.shadowColor = ACCENT;
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#d4ffce';
    ctx.fillRect(h0.x * CELL + 1, h0.y * CELL + 1, CELL - 2, CELL - 2);
    ctx.restore();
  }

  // HUD — score top-left
  ctx.font = `13px ${FONT_MONO}`;
  ctx.fillStyle = TEXT_MUTED;
  ctx.fillText(`SCORE: ${pad3(score)}`, 12, 22);
  ctx.fillText(`BEST:  ${pad3(hiScore)}`, 12, 40);
}

// ─── Overlay ───────────────────────────────────────────────────────────────────
interface OverlayProps {
  phase: Phase;
  score: number;
  hiScore: number;
  onRestart: () => void;
}

function Overlay({ phase, score, hiScore, onRestart }: OverlayProps) {
  const visible = phase === 'start' || phase === 'dead';

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={phase}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onClick={phase === 'dead' ? onRestart : undefined}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(8,8,8,0.80)',
            cursor: phase === 'dead' ? 'pointer' : 'default',
          }}
        >
          <div
            style={{
              background: BG_SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: '32px 52px',
              textAlign: 'center',
              minWidth: 280,
              boxShadow: `0 0 48px rgba(57,255,20,0.07)`,
            }}
          >
            {phase === 'start' && (
              <>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 30,
                    fontWeight: 700,
                    color: ACCENT,
                    letterSpacing: '0.05em',
                    marginBottom: 10,
                    textShadow: `0 0 20px ${ACCENT}66`,
                  }}
                >
                  SNAKE
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 11,
                    color: TEXT_MUTED,
                    letterSpacing: '0.10em',
                    marginBottom: 32,
                  }}
                >
                  ARROW KEYS / WASD
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 12,
                    color: TEXT_PRIMARY,
                    letterSpacing: '0.08em',
                    border: `1px solid ${BORDER}`,
                    padding: '8px 20px',
                    display: 'inline-block',
                  }}
                >
                  [ PRESS ANY KEY ]
                </div>
              </>
            )}

            {phase === 'dead' && (
              <>
                <div
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT_PRIMARY,
                    letterSpacing: '0.06em',
                    marginBottom: 28,
                  }}
                >
                  GAME OVER
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 13,
                    color: TEXT_MUTED,
                    letterSpacing: '0.08em',
                    marginBottom: 8,
                  }}
                >
                  SCORE&nbsp;&nbsp;&nbsp;
                  <span style={{ color: ACCENT, fontWeight: 600 }}>{pad3(score)}</span>
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 13,
                    color: TEXT_MUTED,
                    letterSpacing: '0.08em',
                    marginBottom: 32,
                  }}
                >
                  BEST&nbsp;&nbsp;&nbsp;&nbsp;
                  <span style={{ color: TEXT_PRIMARY }}>{pad3(hiScore)}</span>
                </div>
                <div
                  style={{
                    fontFamily: FONT_MONO,
                    fontSize: 12,
                    color: TEXT_PRIMARY,
                    letterSpacing: '0.06em',
                    border: `1px solid ${BORDER}`,
                    padding: '8px 20px',
                    display: 'inline-block',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  [ PRESS SPACE ] or [ CLICK ]
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Snake component ───────────────────────────────────────────────────────────
export function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // All live game data in a ref — mutated each tick without triggering renders
  const gsRef = useRef<GameState | null>(null);
  const hiScoreRef = useRef<number>(
    parseInt(localStorage.getItem(HI_KEY) ?? '0', 10),
  );
  const canvasSizeRef = useRef({ w: 0, h: 0 });

  // RAF & interval handles
  const rafRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // React state — only for overlay re-renders
  const [overlayPhase, setOverlayPhase] = useState<Phase>('start');
  const [overlayScore, setOverlayScore] = useState(0);
  const [overlayHi, setOverlayHi] = useState(hiScoreRef.current);

  // ── Render loop (RAF) ────────────────────────────────────────────────────────
  const renderLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const gs = gsRef.current;
    if (!canvas || !gs) {
      rafRef.current = requestAnimationFrame(renderLoop);
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      rafRef.current = requestAnimationFrame(renderLoop);
      return;
    }
    const { w, h } = canvasSizeRef.current;
    drawFrame(ctx, gs, w, h, hiScoreRef.current);
    rafRef.current = requestAnimationFrame(renderLoop);
  }, []);

  // ── Game tick (setInterval) ──────────────────────────────────────────────────
  const startInterval = useCallback(() => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const gs = gsRef.current;
      if (!gs || gs.phase !== 'playing') return;

      const next = tickState(gs);
      gsRef.current = next;

      if (next.phase === 'dead') {
        // Update hi score
        if (next.score > hiScoreRef.current) {
          hiScoreRef.current = next.score;
          localStorage.setItem(HI_KEY, String(next.score));
        }
        setOverlayScore(next.score);
        setOverlayHi(hiScoreRef.current);
        setOverlayPhase('dead');
      }
    }, TICK_MS);
  }, []);

  // ── Start / restart game ─────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const { w, h } = canvasSizeRef.current;
    const cols = Math.floor(w / CELL);
    const rows = Math.floor(h / CELL);
    if (cols < 5 || rows < 5) return;

    const freshState = buildInitialState(cols, rows);
    freshState.phase = 'playing';
    gsRef.current = freshState;

    setOverlayPhase('playing');
    startInterval();
  }, [startInterval]);

  // ── Keyboard handler ─────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const gs = gsRef.current;

      // Start screen: any key starts
      if (!gs || gs.phase === 'start') {
        startGame();
        return;
      }

      // Dead: Space restarts
      if (gs.phase === 'dead') {
        if (e.code === 'Space') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      // Playing: direction keys
      const newDir = keyToDir(e.key);
      if (newDir && newDir !== opposite(gs.dir)) {
        // Prevent browser scroll on arrow keys
        if (e.key.startsWith('Arrow')) e.preventDefault();
        gsRef.current = { ...gs, nextDir: newDir };
      }
    },
    [startGame],
  );

  // ── ResizeObserver ───────────────────────────────────────────────────────────
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = Math.floor(width * dpr);
          canvas.height = Math.floor(height * dpr);
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.scale(dpr, dpr);
        }
        canvasSizeRef.current = { w: width, h: height };

        // Rebuild grid geometry if playing
        const gs = gsRef.current;
        if (gs && gs.phase === 'playing') {
          const cols = Math.floor(width / CELL);
          const rows = Math.floor(height / CELL);
          // Clamp snake within new bounds, rebuild food if needed
          const clampedSnake = gs.snake.filter(
            (p) => p.x < cols && p.y < rows,
          );
          const safeSnake = clampedSnake.length > 0 ? clampedSnake : gs.snake.slice(0, 1);
          gsRef.current = {
            ...gs,
            cols,
            rows,
            snake: safeSnake,
            food:
              gs.food.x < cols && gs.food.y < rows
                ? gs.food
                : randomFood(safeSnake, cols, rows),
          };
        } else if (!gs || gs.phase === 'start') {
          // Build initial state so start screen renders something
          const cols = Math.floor(width / CELL);
          const rows = Math.floor(height / CELL);
          if (cols > 4 && rows > 4) {
            gsRef.current = buildInitialState(cols, rows);
          }
        }
      }
    });

    ro.observe(wrapper);
    return () => ro.disconnect();
  }, []);

  // ── Mount: start RAF, attach keyboard ───────────────────────────────────────
  useEffect(() => {
    rafRef.current = requestAnimationFrame(renderLoop);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [renderLoop, handleKeyDown]);

  // ── Click to restart on dead overlay ────────────────────────────────────────
  const handleOverlayClick = useCallback(() => {
    const gs = gsRef.current;
    if (gs && gs.phase === 'dead') startGame();
  }, [startGame]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: BG_BASE,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
        }}
      />
      <Overlay
        phase={overlayPhase}
        score={overlayScore}
        hiScore={overlayHi}
        onRestart={handleOverlayClick}
      />
    </div>
  );
}

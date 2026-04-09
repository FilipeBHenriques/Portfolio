import { useEffect, useRef, useCallback } from 'react';

// ─── Constants ───────────────────────────────────────────────────────────────
const PADDLE_W = 12;
const PADDLE_H = 80;
const BALL_SIZE = 8;
const BALL_SPEED_INIT = 4;
const BALL_SPEED_MAX = 12;
const BALL_SPEED_INC = 0.3;
const AI_SPEED_CAP = 3.5;
const TRAIL_LENGTH = 6;
const WIN_SCORE = 7;
const RESET_PAUSE_MS = 800;
const PADDLE_MARGIN = 20;

const BG_BASE = '#080808';

function readAccent(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#39ff14'
}
function readAccentRgb(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '57, 255, 20'
}
const BG_SURFACE = '#111111';
const TEXT_PRIMARY = '#f0f0f0';
const TEXT_MUTED = '#666666';
const BORDER = '#222222';
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

// ─── Types ───────────────────────────────────────────────────────────────────
type GameState = 'start' | 'playing' | 'paused' | 'won';

interface Vec2 {
  x: number;
  y: number;
}

interface Ball {
  pos: Vec2;
  vel: Vec2;
  speed: number;
  trail: Vec2[];
}

interface Paddle {
  y: number;
  score: number;
}

interface GameData {
  state: GameState;
  ball: Ball;
  player: Paddle;
  ai: Paddle;
  pauseUntil: number;
  winner: 'player' | 'ai' | null;
  keys: Set<string>;
  width: number;
  height: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function randomAngle(): Vec2 {
  // Random angle in ~30–60° or ~120–150° range (avoid near-horizontal or near-vertical)
  const angle = (Math.random() * 0.6 + 0.4) * (Math.PI / 2) * (Math.random() < 0.5 ? 1 : -1);
  const dir = Math.random() < 0.5 ? 1 : -1;
  return {
    x: Math.cos(angle) * dir,
    y: Math.sin(angle),
  };
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function makeBall(width: number, height: number): Ball {
  const dir = randomAngle();
  return {
    pos: { x: width / 2 - BALL_SIZE / 2, y: height / 2 - BALL_SIZE / 2 },
    vel: { x: dir.x * BALL_SPEED_INIT, y: dir.y * BALL_SPEED_INIT },
    speed: BALL_SPEED_INIT,
    trail: [],
  };
}

function makeGame(width: number, height: number): GameData {
  return {
    state: 'start',
    ball: makeBall(width, height),
    player: { y: height / 2 - PADDLE_H / 2, score: 0 },
    ai: { y: height / 2 - PADDLE_H / 2, score: 0 },
    pauseUntil: 0,
    winner: null,
    keys: new Set(),
    width,
    height,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────
export function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<GameData | null>(null);
  const rafRef = useRef<number>(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // ── Draw ──────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const ctx = ctxRef.current;
    const g = gameRef.current;
    if (!ctx || !g) return;
    const bgBase = getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim() || BG_BASE
    const textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || TEXT_PRIMARY
    const textMuted = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || TEXT_MUTED

    const { width, height, ball, player, ai, state, winner } = g;

    // Background
    ctx.fillStyle = bgBase;
    ctx.fillRect(0, 0, width, height);

    // Center dashed line
    ctx.save();
    ctx.setLineDash([4, 8]);
    ctx.strokeStyle = `rgba(${readAccentRgb()},0.1)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.restore();

    // Ball trail
    ball.trail.forEach((pos, i) => {
      const alpha = ((i + 1) / TRAIL_LENGTH) * 0.5;
      const scale = 0.4 + (i / TRAIL_LENGTH) * 0.6;
      const size = BALL_SIZE * scale;
      const offset = (BALL_SIZE - size) / 2;
      ctx.fillStyle = `rgba(${readAccentRgb()},${alpha})`;
      ctx.fillRect(pos.x + offset, pos.y + offset, size, size);
    });

    // Ball
    ctx.fillStyle = readAccent();
    ctx.shadowColor = readAccent();
    ctx.shadowBlur = 10;
    ctx.fillRect(ball.pos.x, ball.pos.y, BALL_SIZE, BALL_SIZE);
    ctx.shadowBlur = 0;

    // Player paddle (left, accent)
    ctx.fillStyle = readAccent();
    ctx.shadowColor = readAccent();
    ctx.shadowBlur = 8;
    ctx.fillRect(PADDLE_MARGIN, player.y, PADDLE_W, PADDLE_H);
    ctx.shadowBlur = 0;

    // AI paddle (right, white-ish)
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(width - PADDLE_MARGIN - PADDLE_W, ai.y, PADDLE_W, PADDLE_H);

    // Score
    const scoreText = `${String(player.score).padStart(2, '0')} — ${String(ai.score).padStart(2, '0')}`;
    ctx.fillStyle = textPrimary;
    ctx.font = `bold 28px ${FONT_MONO}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(scoreText, width / 2, 16);

    // Overlays
    if (state === 'start') {
      drawOverlay(ctx, width, height, [
        { text: 'PONG', size: 72, font: FONT_DISPLAY, color: readAccent(), glow: true },
        { text: 'W/S  vs  AI', size: 16, font: FONT_MONO, color: textMuted, glow: false },
        { text: '[ PRESS SPACE ]', size: 14, font: FONT_MONO, color: readAccent(), glow: false },
      ]);
    } else if (state === 'won' && winner) {
      const winnerText = winner === 'player' ? 'YOU WIN' : 'AI WINS';
      drawOverlay(ctx, width, height, [
        { text: winnerText, size: 60, font: FONT_DISPLAY, color: readAccent(), glow: true },
        { text: `${String(player.score).padStart(2, '0')}  —  ${String(ai.score).padStart(2, '0')}`, size: 24, font: FONT_MONO, color: textPrimary, glow: false },
        { text: '[ SPACE / CLICK ]', size: 14, font: FONT_MONO, color: readAccent(), glow: false },
      ]);
    }
  }, []);

  function drawOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    lines: { text: string; size: number; font: string; color: string; glow: boolean }[]
  ) {
    // Dim background
    ctx.fillStyle = 'rgba(8,8,8,0.82)';
    ctx.fillRect(0, 0, width, height);

    // Border box
    const boxW = Math.min(420, width - 48);
    const boxH = 200;
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || BORDER;
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxW, boxH);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-surface').trim() || BG_SURFACE;
    ctx.fillRect(boxX, boxY, boxW, boxH);

    // Lines
    const totalLines = lines.length;
    const padding = 24;
    const innerH = boxH - padding * 2;
    const lineSpacing = innerH / (totalLines + 1);

    lines.forEach((line, i) => {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${i === 0 ? 'bold ' : ''}${line.size}px ${line.font}`;
      ctx.fillStyle = line.color;
      if (line.glow) {
        ctx.shadowColor = readAccent();
        ctx.shadowBlur = 20;
      }
      ctx.fillText(line.text, width / 2, boxY + padding + lineSpacing * (i + 1));
      ctx.shadowBlur = 0;
    });
  }

  // ── Update ────────────────────────────────────────────────────────────────
  const update = useCallback(() => {
    const g = gameRef.current;
    if (!g || g.state !== 'playing') return;

    const { width, height, keys } = g;
    const now = performance.now();

    // Still in pause?
    if (now < g.pauseUntil) return;

    // Player movement
    const playerSpeed = 5;
    if (keys.has('w') || keys.has('arrowup')) {
      g.player.y = clamp(g.player.y - playerSpeed, 0, height - PADDLE_H);
    }
    if (keys.has('s') || keys.has('arrowdown')) {
      g.player.y = clamp(g.player.y + playerSpeed, 0, height - PADDLE_H);
    }

    // AI movement
    const ballCenterY = g.ball.pos.y + BALL_SIZE / 2;
    const aiCenterY = g.ai.y + PADDLE_H / 2;
    const aiDiff = ballCenterY - aiCenterY;
    const aiMove = clamp(aiDiff, -AI_SPEED_CAP, AI_SPEED_CAP);
    g.ai.y = clamp(g.ai.y + aiMove, 0, height - PADDLE_H);

    // Ball trail: push current position before moving
    g.ball.trail.push({ x: g.ball.pos.x, y: g.ball.pos.y });
    if (g.ball.trail.length > TRAIL_LENGTH) g.ball.trail.shift();

    // Move ball
    g.ball.pos.x += g.ball.vel.x;
    g.ball.pos.y += g.ball.vel.y;

    // Wall bounce (top/bottom)
    if (g.ball.pos.y <= 0) {
      g.ball.pos.y = 0;
      g.ball.vel.y = Math.abs(g.ball.vel.y);
    } else if (g.ball.pos.y + BALL_SIZE >= height) {
      g.ball.pos.y = height - BALL_SIZE;
      g.ball.vel.y = -Math.abs(g.ball.vel.y);
    }

    // ── Player paddle collision (left) ──
    const playerX = PADDLE_MARGIN;
    if (
      g.ball.vel.x < 0 &&
      g.ball.pos.x <= playerX + PADDLE_W &&
      g.ball.pos.x + BALL_SIZE >= playerX &&
      g.ball.pos.y + BALL_SIZE >= g.player.y &&
      g.ball.pos.y <= g.player.y + PADDLE_H
    ) {
      g.ball.pos.x = playerX + PADDLE_W;
      const newSpeed = Math.min(g.ball.speed + BALL_SPEED_INC, BALL_SPEED_MAX);
      g.ball.speed = newSpeed;
      const hitPos = (g.ball.pos.y + BALL_SIZE / 2 - g.player.y) / PADDLE_H; // 0..1
      const angle = (hitPos - 0.5) * (Math.PI * 0.75); // –67.5°..+67.5°
      g.ball.vel.x = Math.cos(angle) * newSpeed;
      g.ball.vel.y = Math.sin(angle) * newSpeed;
      // Ensure going right
      g.ball.vel.x = Math.abs(g.ball.vel.x);
    }

    // ── AI paddle collision (right) ──
    const aiX = width - PADDLE_MARGIN - PADDLE_W;
    if (
      g.ball.vel.x > 0 &&
      g.ball.pos.x + BALL_SIZE >= aiX &&
      g.ball.pos.x <= aiX + PADDLE_W &&
      g.ball.pos.y + BALL_SIZE >= g.ai.y &&
      g.ball.pos.y <= g.ai.y + PADDLE_H
    ) {
      g.ball.pos.x = aiX - BALL_SIZE;
      const newSpeed = Math.min(g.ball.speed + BALL_SPEED_INC, BALL_SPEED_MAX);
      g.ball.speed = newSpeed;
      const hitPos = (g.ball.pos.y + BALL_SIZE / 2 - g.ai.y) / PADDLE_H;
      const angle = (hitPos - 0.5) * (Math.PI * 0.75);
      g.ball.vel.x = Math.cos(angle) * newSpeed;
      g.ball.vel.y = Math.sin(angle) * newSpeed;
      // Ensure going left
      g.ball.vel.x = -Math.abs(g.ball.vel.x);
    }

    // ── Scoring ──
    if (g.ball.pos.x + BALL_SIZE < 0) {
      // AI scores
      g.ai.score += 1;
      handleScore(g);
    } else if (g.ball.pos.x > width) {
      // Player scores
      g.player.score += 1;
      handleScore(g);
    }
  }, []);

  function handleScore(g: GameData) {
    if (g.player.score >= WIN_SCORE) {
      g.state = 'won';
      g.winner = 'player';
      return;
    }
    if (g.ai.score >= WIN_SCORE) {
      g.state = 'won';
      g.winner = 'ai';
      return;
    }
    // Reset ball with pause
    g.ball = makeBall(g.width, g.height);
    g.pauseUntil = performance.now() + RESET_PAUSE_MS;
  }

  // ── Game loop ─────────────────────────────────────────────────────────────
  const loop = useCallback(() => {
    update();
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [update, draw]);

  // ── Start / rematch ───────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    if (g.state === 'start' || g.state === 'won') {
      const fresh = makeGame(g.width, g.height);
      fresh.keys = g.keys;
      fresh.state = 'playing';
      fresh.pauseUntil = performance.now() + RESET_PAUSE_MS;
      gameRef.current = fresh;
    }
  }, []);

  // ── Input ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const g = gameRef.current;
      if (!g) return;

      g.keys.add(key);

      // Prevent scroll on arrow keys / space
      if (['arrowup', 'arrowdown', ' '].includes(e.key.toLowerCase()) ||
          e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Spacebar') {
        startGame();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      gameRef.current?.keys.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [startGame]);

  // ── Click to start/rematch ────────────────────────────────────────────────
  const handleClick = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    if (g.state === 'start' || g.state === 'won') {
      startGame();
    }
  }, [startGame]);

  // ── ResizeObserver ────────────────────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    const applySize = (w: number, h: number) => {
      canvas.width = w;
      canvas.height = h;
      if (!gameRef.current) {
        gameRef.current = makeGame(w, h);
      } else {
        // Update dimensions, re-center paddles if needed
        gameRef.current.width = w;
        gameRef.current.height = h;
        // Keep paddles clamped
        gameRef.current.player.y = clamp(gameRef.current.player.y, 0, h - PADDLE_H);
        gameRef.current.ai.y = clamp(gameRef.current.ai.y, 0, h - PADDLE_H);
      }
    };

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          applySize(Math.floor(width), Math.floor(height));
        }
      }
    });

    ro.observe(container);

    // Initial size
    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      applySize(Math.floor(rect.width), Math.floor(rect.height));
    }

    return () => ro.disconnect();
  }, []);

  // ── RAF loop start/stop ───────────────────────────────────────────────────
  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [loop]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        display: 'block',
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
    </div>
  );
}

import { useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Ball {
  x: number; y: number; vx: number; vy: number; speed: number;
}
interface Paddle {
  x: number; y: number; width: number; height: number;
}
interface Brick {
  x: number; y: number; width: number; height: number;
  alive: boolean; row: number; points: number; flash: boolean;
}

function readAccent(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#39ff14'
}
function readAccentRgb(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '57, 255, 20'
}
function rowColors(rgb: string): string[] {
  return [
    `rgba(${rgb},0.95)`, `rgba(${rgb},0.80)`,
    `rgba(${rgb},0.65)`, `rgba(${rgb},0.50)`,
    `rgba(${rgb},0.35)`, `rgba(${rgb},0.20)`,
  ]
}
interface TrailPoint { x: number; y: number; }

type PowerupType = 'WIDE' | 'SLOW' | 'LIFE' | 'FAST' | 'MULTI';
interface Powerup {
  x: number; y: number;
  type: PowerupType;
  collected: boolean;
}

type GamePhase = 'start' | 'playing' | 'dead';

// ─── Constants ────────────────────────────────────────────────────────────────

const BALL_SIZE           = 8;
const PADDLE_WIDTH        = 100;
const PADDLE_HEIGHT       = 10;
const PADDLE_BOTTOM_MARGIN = 30;
const BRICK_ROWS          = 6;
const BRICK_COLS          = 10;
const BRICK_GAP           = 4;
const BRICK_HEIGHT        = 18;
const BRICK_TOP_MARGIN    = 60;
const TRAIL_LENGTH        = 5;
const ARROW_SPEED         = 5;
const BASE_SPEED          = 4;
const SPEED_INCREMENT     = 0.5;
const POWERUP_W           = 36;
const POWERUP_H           = 14;
const POWERUP_FALL        = 1.8;
const POWERUP_CHANCE      = 0.28;   // 28 % per brick
const WIDE_DURATION       = 8000;
const SLOW_DURATION       = 7000;
const FAST_DURATION       = 5000;
const HI_SCORE_KEY        = 'breakout_hi';

const ROW_POINTS  = [5, 4, 3, 2, 1, 1];

const POWERUP_META: Record<PowerupType, { label: string; color: string; glow: string }> = {
  WIDE:  { label: '+W',  color: '#39ff14', glow: '#39ff14' },
  SLOW:  { label: '+S',  color: '#9feeff', glow: '#9feeff' },
  LIFE:  { label: '+1',  color: '#ff4da6', glow: '#ff4da6' },
  FAST:  { label: '!!',  color: '#ff6600', glow: '#ff6600' },
  MULTI: { label: '+M',  color: '#c8ffb4', glow: '#c8ffb4' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildBricks(canvasWidth: number): Brick[] {
  const brickWidth = canvasWidth / BRICK_COLS - BRICK_GAP;
  return Array.from({ length: BRICK_ROWS * BRICK_COLS }, (_, idx) => {
    const row = Math.floor(idx / BRICK_COLS);
    const col = idx % BRICK_COLS;
    return {
      x: col * (brickWidth + BRICK_GAP) + BRICK_GAP / 2,
      y: BRICK_TOP_MARGIN + row * (BRICK_HEIGHT + BRICK_GAP),
      width: brickWidth,
      height: BRICK_HEIGHT,
      alive: true,
      row,
      points: ROW_POINTS[row],
      flash: false,
    };
  });
}

function randomUpwardAngle(speed: number) {
  const angle = (Math.random() * 120 - 60) * (Math.PI / 180);
  return { vx: speed * Math.sin(angle), vy: -speed * Math.cos(angle) };
}

function aabb(ax: number, ay: number, aw: number, ah: number,
               bx: number, by: number, bw: number, bh: number) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function scaleBallToSpeed(ball: Ball, newSpeed: number) {
  const cur = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) || newSpeed;
  ball.vx   = (ball.vx / cur) * newSpeed;
  ball.vy   = (ball.vy / cur) * newSpeed;
  ball.speed = newSpeed;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Breakout() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const phaseRef     = useRef<GamePhase>('start');
  const ballsRef     = useRef<Ball[]>([]);
  const paddleRef    = useRef<Paddle>({ x: 0, y: 0, width: PADDLE_WIDTH, height: PADDLE_HEIGHT });
  const bricksRef    = useRef<Brick[]>([]);
  const powerupsRef  = useRef<Powerup[]>([]);
  const trailsRef    = useRef<TrailPoint[][]>([]);
  const livesRef     = useRef(3);
  const scoreRef     = useRef(0);
  const hiScoreRef   = useRef(0);
  const levelRef     = useRef(1);
  const ballSpeedRef = useRef(BASE_SPEED); // base speed for this level
  const keysRef      = useRef({ left: false, right: false });
  const mousePosRef  = useRef<number | null>(null);
  const rafRef       = useRef<number>(0);
  const sizeRef      = useRef({ width: 0, height: 0 });

  // Active effects: store end timestamp (null = inactive)
  const fxRef = useRef({
    wide:             null as number | null,
    slow:             null as number | null,
    fast:             null as number | null,
    speedBeforeEffect: BASE_SPEED,
  });

  // ── Helpers ──────────────────────────────────────────────────────────────

  const applyEffect = useCallback((type: PowerupType) => {
    const balls   = ballsRef.current;
    const paddle  = paddleRef.current;
    const fx      = fxRef.current;
    const now     = Date.now();

    if (type === 'WIDE') {
      paddle.width = PADDLE_WIDTH * 2;
      fx.wide = now + WIDE_DURATION;
    } else if (type === 'LIFE') {
      livesRef.current = Math.min(livesRef.current + 1, 5);
    } else if (type === 'SLOW') {
      // cancel fast if active
      if (fx.fast) { fx.fast = null; }
      if (!fx.slow && balls.length > 0) fx.speedBeforeEffect = balls[0].speed;
      for (const ball of balls) scaleBallToSpeed(ball, ball.speed * 0.55);
      fx.slow = now + SLOW_DURATION;
    } else if (type === 'FAST') {
      if (fx.slow) { fx.slow = null; }
      if (!fx.fast && balls.length > 0) fx.speedBeforeEffect = balls[0].speed;
      for (const ball of balls) scaleBallToSpeed(ball, Math.min(ball.speed * 1.6, 14));
      fx.fast = now + FAST_DURATION;
    } else if (type === 'MULTI') {
      const existing = ballsRef.current;
      if (existing.length === 0) return;
      const src = existing[0];  // clone from first ball
      for (const offset of [-25, 25]) {
        const rad = offset * (Math.PI / 180);
        const cos = Math.cos(rad), sin = Math.sin(rad);
        const speed = src.speed;
        const nvx = src.vx * cos - src.vy * sin;
        const nvy = src.vx * sin + src.vy * cos;
        const mag = Math.sqrt(nvx * nvx + nvy * nvy) || speed;
        ballsRef.current.push({ ...src, vx: (nvx / mag) * speed, vy: (nvy / mag) * speed });
        trailsRef.current.push([]);
      }
    }
  }, []);

  const expireEffects = useCallback(() => {
    const balls   = ballsRef.current;
    const paddle  = paddleRef.current;
    const fx      = fxRef.current;
    const now     = Date.now();

    if (fx.wide && now > fx.wide) {
      paddle.width = PADDLE_WIDTH;
      fx.wide = null;
    }
    if (fx.slow && now > fx.slow) {
      for (const ball of balls) scaleBallToSpeed(ball, fx.speedBeforeEffect);
      fx.slow = null;
    }
    if (fx.fast && now > fx.fast) {
      for (const ball of balls) scaleBallToSpeed(ball, fx.speedBeforeEffect);
      fx.fast = null;
    }
  }, []);

  const resetBall = useCallback((h: number) => {
    const paddle = paddleRef.current;
    const speed  = ballSpeedRef.current;
    const { vx, vy } = randomUpwardAngle(speed);
    ballsRef.current = [{
      x: paddle.x + paddle.width / 2 - BALL_SIZE / 2,
      y: h - PADDLE_BOTTOM_MARGIN - PADDLE_HEIGHT - BALL_SIZE - 4,
      vx, vy, speed,
    }];
    trailsRef.current = [[]];
  }, []);

  const startGame = useCallback(() => {
    const { width, height } = sizeRef.current;
    ballSpeedRef.current = BASE_SPEED;
    livesRef.current     = 3;
    scoreRef.current     = 0;
    levelRef.current     = 1;
    powerupsRef.current  = [];
    const fx             = fxRef.current;
    fx.wide = fx.slow = fx.fast = null;
    paddleRef.current = {
      x: width / 2 - PADDLE_WIDTH / 2, y: height - PADDLE_BOTTOM_MARGIN - PADDLE_HEIGHT,
      width: PADDLE_WIDTH, height: PADDLE_HEIGHT,
    };
    bricksRef.current = buildBricks(width);
    resetBall(height);
    phaseRef.current = 'playing';
  }, [resetBall]);

  const nextLevel = useCallback(() => {
    const { width, height } = sizeRef.current;
    levelRef.current    += 1;
    ballSpeedRef.current = Math.min(ballSpeedRef.current + SPEED_INCREMENT, 10);
    powerupsRef.current  = [];
    bricksRef.current    = buildBricks(width);
    // Keep wide effect, reset speed effects
    const fx = fxRef.current;
    fx.slow = fx.fast = null;
    resetBall(height);
  }, [resetBall]);

  // ── Draw ─────────────────────────────────────────────────────────────────

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx   = canvas.getContext('2d')!;
    const { width, height } = sizeRef.current;
    const phase = phaseRef.current;

    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim() || '#080808';
    ctx.fillRect(0, 0, width, height);

    if (phase === 'start') {
      drawOverlay(ctx, width, height, 'BREAKOUT',
        ['MOUSE · ← → · A/D', '', '[ PRESS SPACE ]']);
      return;
    }

    // Trails (one per ball)
    const trails = trailsRef.current;
    for (let bi = 0; bi < trails.length; bi++) {
      const trail = trails[bi];
      for (let i = 0; i < trail.length; i++) {
        const a = ((i + 1) / (trail.length + 1)) * 0.35;
        ctx.fillStyle = `rgba(${readAccentRgb()},${a.toFixed(2)})`;
        const t = trail[i];
        ctx.fillRect(t.x, t.y, BALL_SIZE, BALL_SIZE);
      }
    }

    // Bricks
    for (const b of bricksRef.current) {
      if (!b.alive) continue;
      if (b.flash) {
        ctx.fillStyle = 'rgba(200,255,180,0.95)';
        ctx.fillRect(b.x - 1, b.y - 1, b.width + 2, b.height + 2);
        b.flash = false;
      } else {
        ctx.fillStyle = rowColors(readAccentRgb())[b.row];
        ctx.fillRect(b.x, b.y, b.width, b.height);
        ctx.strokeStyle = `rgba(${readAccentRgb()},0.3)`;
        ctx.lineWidth   = 1;
        ctx.strokeRect(b.x + .5, b.y + .5, b.width - 1, b.height - 1);
      }
    }

    // Power-ups
    for (const pu of powerupsRef.current) {
      if (pu.collected) continue;
      const meta = POWERUP_META[pu.type];
      const puColor = pu.type === 'WIDE' ? readAccent() : meta.color;
      ctx.save();
      ctx.shadowColor = puColor;
      ctx.shadowBlur  = 8;
      ctx.fillStyle   = puColor;
      ctx.fillRect(pu.x, pu.y, POWERUP_W, POWERUP_H);
      ctx.shadowBlur  = 0;
      ctx.fillStyle   = getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim() || '#080808';
      ctx.font        = "bold 9px 'JetBrains Mono', monospace";
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(meta.label, pu.x + POWERUP_W / 2, pu.y + POWERUP_H / 2);
      ctx.textBaseline = 'alphabetic';
      ctx.restore();
    }

    // Paddle
    const paddle = paddleRef.current;
    const fx     = fxRef.current;
    const paddleColor = fx.wide ? `rgba(${readAccentRgb()},0.75)` : readAccent();
    ctx.fillStyle   = paddleColor;
    ctx.shadowColor = paddleColor;
    ctx.shadowBlur  = 8;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.shadowBlur  = 0;

    // Balls
    const balls = ballsRef.current;
    const ballColor = fx.slow ? `rgba(${readAccentRgb()},0.75)` : fx.fast ? '#ff6600' : readAccent();
    for (const ball of balls) {
      ctx.fillStyle   = ballColor;
      ctx.shadowColor = ballColor;
      ctx.shadowBlur  = 12;
      ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
      ctx.shadowBlur  = 0;
    }

    // HUD
    ctx.font      = "13px 'JetBrains Mono', monospace";
    ctx.textAlign = 'left';
    ctx.fillStyle = readAccent();
    const liveStr = Array.from({ length: 5 }, (_, i) =>
      i < livesRef.current ? '■' : '□'
    ).slice(0, Math.max(livesRef.current, 3)).join(' ');
    ctx.fillText(`LIVES: ${liveStr}`, 12, 24);

    ctx.textAlign = 'right';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#f0f0f0';
    ctx.fillText(`SCORE  ${scoreRef.current}`, width - 12, 24);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#666666';
    ctx.fillText(`BEST   ${hiScoreRef.current}`, width - 12, 42);

    ctx.textAlign = 'center';
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#666666';
    ctx.fillText(`LVL ${levelRef.current}`, width / 2, 24);

    // Active effect indicators
    const now    = Date.now();
    const pills: { label: string; color: string; rem: number }[] = [];
    if (fx.wide) pills.push({ label: '+WIDE', color: readAccent(), rem: fx.wide - now });
    if (fx.slow) pills.push({ label: '+SLOW', color: `rgba(${readAccentRgb()},0.75)`, rem: fx.slow - now });
    if (fx.fast) pills.push({ label: '!FAST', color: '#ff6600', rem: fx.fast - now });

    if (pills.length > 0) {
      let px = width / 2 - (pills.length * 60) / 2;
      for (const pill of pills) {
        const barW = 54 * Math.max(0, pill.rem / (
          pill.label.includes('WIDE') ? WIDE_DURATION :
          pill.label.includes('SLOW') ? SLOW_DURATION : FAST_DURATION
        ));
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(px, 36, 54, 6);
        ctx.fillStyle = pill.color;
        ctx.fillRect(px, 36, barW, 6);
        ctx.fillStyle = pill.color;
        ctx.font      = "9px 'JetBrains Mono', monospace";
        ctx.textAlign = 'center';
        ctx.fillText(pill.label, px + 27, 55);
        px += 60;
      }
    }

    if (phase === 'dead') {
      drawOverlay(ctx, width, height, 'GAME OVER', [
        `SCORE    ${scoreRef.current}`,
        `BEST     ${hiScoreRef.current}`,
        '',
        '[ SPACE / CLICK ]',
      ], true);
    }
  }, []);

  // ── Update ───────────────────────────────────────────────────────────────

  const update = useCallback(() => {
    if (phaseRef.current !== 'playing') return;

    const { width, height } = sizeRef.current;
    const paddle = paddleRef.current;

    expireEffects();

    // Keyboard has priority; mouse is fallback only when no key is held
    const usingKeyboard = keysRef.current.left || keysRef.current.right;
    if (usingKeyboard) {
      if (keysRef.current.left)  paddle.x = Math.max(0, paddle.x - ARROW_SPEED);
      if (keysRef.current.right) paddle.x = Math.min(width - paddle.width, paddle.x + ARROW_SPEED);
    } else if (mousePosRef.current !== null) {
      paddle.x = Math.max(0, Math.min(width - paddle.width, mousePosRef.current - paddle.width / 2));
    }

    // Process each ball in reverse so splice doesn't skip indices
    const balls  = ballsRef.current;
    const trails = trailsRef.current;

    for (let bi = balls.length - 1; bi >= 0; bi--) {
      const ball  = balls[bi];
      const trail = trails[bi];

      // Trail
      trail.push({ x: ball.x, y: ball.y });
      if (trail.length > TRAIL_LENGTH) trail.shift();

      // Move ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall bounces
      if (ball.x <= 0)               { ball.x = 0;                ball.vx =  Math.abs(ball.vx); }
      if (ball.x + BALL_SIZE >= width){ ball.x = width - BALL_SIZE; ball.vx = -Math.abs(ball.vx); }
      if (ball.y <= 0)               { ball.y = 0;                ball.vy =  Math.abs(ball.vy); }

      // Paddle collision
      if (ball.vy > 0 && aabb(ball.x, ball.y, BALL_SIZE, BALL_SIZE,
          paddle.x, paddle.y, paddle.width, paddle.height)) {
        const hit   = (ball.x + BALL_SIZE / 2 - paddle.x) / paddle.width;
        const angle = (hit - 0.5) * 140 * (Math.PI / 180);
        const spd   = ball.speed;
        ball.vx = spd * Math.sin(angle);
        ball.vy = -spd * Math.cos(angle);
        ball.y  = paddle.y - BALL_SIZE;
      }

      // Ball off bottom
      if (ball.y > height) {
        if (balls.length > 1) {
          // Other balls still in play — just remove this one, no life lost
          balls.splice(bi, 1);
          trails.splice(bi, 1);
        } else {
          // Last ball — lose a life
          livesRef.current -= 1;
          if (livesRef.current <= 0) {
            livesRef.current = 0;
            const hi = parseInt(localStorage.getItem(HI_SCORE_KEY) ?? '0', 10);
            if (scoreRef.current > hi) {
              localStorage.setItem(HI_SCORE_KEY, String(scoreRef.current));
              hiScoreRef.current = scoreRef.current;
            }
            phaseRef.current = 'dead';
          } else {
            // Reset effects on life loss
            const fx = fxRef.current;
            if (fx.slow || fx.fast) {
              fx.slow = fx.fast = null;
            }
            resetBall(height);
          }
          return;
        }
        continue;
      }

      // Brick collisions for this ball
      for (const brick of bricksRef.current) {
        if (!brick.alive) continue;
        if (!aabb(ball.x, ball.y, BALL_SIZE, BALL_SIZE,
                  brick.x, brick.y, brick.width, brick.height)) continue;

        const ol  = ball.x + BALL_SIZE - brick.x;
        const or_ = brick.x + brick.width - ball.x;
        const ot  = ball.y + BALL_SIZE - brick.y;
        const ob  = brick.y + brick.height - ball.y;
        const mh  = Math.min(ol, or_);
        const mv  = Math.min(ot, ob);

        if (mh < mv) ball.vx = -ball.vx; else ball.vy = -ball.vy;

        brick.alive = false;
        brick.flash = true;
        scoreRef.current += brick.points;
        if (scoreRef.current > hiScoreRef.current) {
          hiScoreRef.current = scoreRef.current;
          localStorage.setItem(HI_SCORE_KEY, String(hiScoreRef.current));
        }

        // Speed up ball on hit (gentle)
        const newSpd = Math.min(ball.speed + 0.15, 14);
        scaleBallToSpeed(ball, newSpd);

        // Maybe drop a power-up
        if (Math.random() < POWERUP_CHANCE) {
          const types: PowerupType[] = ['WIDE', 'SLOW', 'LIFE', 'FAST', 'MULTI'];
          // Weight: LIFE is rarer, FAST and MULTI share weight 2
          const weights = [3, 3, 1, 2, 2];
          const total   = weights.reduce((a, b) => a + b, 0);
          let r         = Math.random() * total;
          let chosen: PowerupType = 'WIDE';
          for (let i = 0; i < types.length; i++) {
            r -= weights[i];
            if (r <= 0) { chosen = types[i]; break; }
          }
          powerupsRef.current.push({
            x: brick.x + brick.width / 2 - POWERUP_W / 2,
            y: brick.y + brick.height,
            type: chosen,
            collected: false,
          });
        }

        break; // one brick per frame per ball
      }
    }

    // Power-up physics + collection (after all balls processed)
    for (const pu of powerupsRef.current) {
      if (pu.collected) continue;
      pu.y += POWERUP_FALL;
      if (pu.y > height) { pu.collected = true; continue; }
      if (aabb(pu.x, pu.y, POWERUP_W, POWERUP_H,
               paddle.x, paddle.y, paddle.width, paddle.height)) {
        pu.collected = true;
        applyEffect(pu.type);
      }
    }
    // Prune collected/off-screen
    powerupsRef.current = powerupsRef.current.filter(p => !p.collected);

    // Check level clear
    if (ballsRef.current.length > 0 && !bricksRef.current.some(b => b.alive)) {
      nextLevel();
    }
  }, [resetBall, nextLevel, applyEffect, expireEffects]);

  // ── Loop ─────────────────────────────────────────────────────────────────

  const loop = useCallback(() => {
    update();
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [update, draw]);

  // ── Resize ───────────────────────────────────────────────────────────────

  const handleResize = useCallback((w: number, h: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = w;
    canvas.height = h;
    sizeRef.current = { width: w, height: h };
    const paddle = paddleRef.current;
    paddle.y = h - PADDLE_BOTTOM_MARGIN - PADDLE_HEIGHT;
    paddle.x = Math.max(0, Math.min(w - paddle.width, paddle.x));
    if (phaseRef.current === 'playing') bricksRef.current = buildBricks(w);
    for (const ball of ballsRef.current) {
      if (ball.x > w - BALL_SIZE) ball.x = w - BALL_SIZE;
    }
  }, []);

  // ── Mount ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    hiScoreRef.current = parseInt(localStorage.getItem(HI_SCORE_KEY) ?? '0', 10);

    const rect = container.getBoundingClientRect();
    handleResize(Math.floor(rect.width) || 400, Math.floor(rect.height) || 500);
    paddleRef.current = {
      x: (rect.width || 400) / 2 - PADDLE_WIDTH / 2,
      y: (rect.height || 500) - PADDLE_BOTTOM_MARGIN - PADDLE_HEIGHT,
      width: PADDLE_WIDTH, height: PADDLE_HEIGHT,
    };

    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width > 0 && height > 0) handleResize(Math.floor(width), Math.floor(height));
      }
    });
    ro.observe(container);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') { e.preventDefault(); keysRef.current.left  = true; }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); keysRef.current.right = true; }
      if (e.key === ' ') {
        e.preventDefault();
        if (phaseRef.current === 'start' || phaseRef.current === 'dead') startGame();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') keysRef.current.left  = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup',   onKeyUp);

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mousePosRef.current = e.clientX - r.left;
    };
    const onMouseLeave = () => { mousePosRef.current = null; };
    canvas.addEventListener('mousemove',  onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const onClick = () => {
      if (phaseRef.current === 'start' || phaseRef.current === 'dead') startGame();
    };
    canvas.addEventListener('click', onClick);

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup',   onKeyUp);
      canvas.removeEventListener('mousemove',  onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [handleResize, startGame, loop]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: 'var(--bg-base)',
               overflow: 'hidden', userSelect: 'none', cursor: 'none' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}

// ─── Overlay helper ───────────────────────────────────────────────────────────

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  title: string,
  lines: string[],
  dimBg = false,
) {
  ctx.save();
  ctx.fillStyle = dimBg ? 'rgba(8,8,8,0.88)' : 'rgba(8,8,8,0.85)';
  ctx.fillRect(0, 0, w, h);

  ctx.textAlign  = 'center';
  ctx.shadowColor = readAccent();
  ctx.shadowBlur  = 20;
  ctx.font        = "bold 48px 'JetBrains Mono', monospace";
  ctx.fillStyle   = readAccent();
  ctx.fillText(title, w / 2, h / 2 - 60);
  ctx.shadowBlur  = 0;

  lines.forEach((line, i) => {
    if (!line) return;
    const isLast = i === lines.length - 1;
    ctx.font      = `${isLast ? 14 : 16}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isLast
      ? getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#f0f0f0'
      : i === 1
        ? readAccent()
        : getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#666666';
    ctx.fillText(line, w / 2, h / 2 - 10 + i * 30);
  });
  ctx.restore();
}

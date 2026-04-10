import { useState, useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type CellState = 'hidden' | 'revealed' | 'flagged';
type GamePhase = 'idle' | 'playing' | 'won' | 'lost';
type Mode = 'easy' | 'medium' | 'hard';

interface Cell {
  mine: boolean;
  adj: number;
  state: CellState;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MODES: Record<Mode, { rows: number; cols: number; mines: number; cellPx: number }> = {
  easy:   { rows: 9,  cols: 9,  mines: 10, cellPx: 36 },
  medium: { rows: 16, cols: 16, mines: 40, cellPx: 34 },
  hard:   { rows: 16, cols: 30, mines: 99, cellPx: 32 },
};

const NUM_COLORS: Record<number, string> = {
  1: 'var(--accent)',
  2: '#00c8ff',
  3: '#ff4444',
  4: '#bf5fff',
  5: '#ff6b00',
  6: '#00ffcc',
  7: '#ff2d78',
  8: '#888888',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeBoard(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ mine: false, adj: 0, state: 'hidden' as CellState }))
  );
}

function plantMines(
  board: Cell[][],
  rows: number,
  cols: number,
  count: number,
  safeR: number,
  safeC: number,
): Cell[][] {
  const b = board.map(row => row.map(cell => ({ ...cell })));
  const safe = new Set<string>();
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      const nr = safeR + dr, nc = safeC + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) safe.add(`${nr},${nc}`);
    }

  let placed = 0;
  while (placed < count) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!b[r][c].mine && !safe.has(`${r},${c}`)) { b[r][c].mine = true; placed++; }
  }

  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (b[r][c].mine) continue;
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && b[nr][nc].mine) n++;
        }
      b[r][c].adj = n;
    }

  return b;
}

function floodReveal(board: Cell[][], rows: number, cols: number, startR: number, startC: number): Cell[][] {
  const b = board.map(row => row.map(cell => ({ ...cell })));
  const queue: [number, number][] = [[startR, startC]];
  const seen = new Set<string>();

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const key = `${r},${c}`;
    if (seen.has(key) || r < 0 || r >= rows || c < 0 || c >= cols) continue;
    seen.add(key);
    const cell = b[r][c];
    if (cell.state !== 'hidden' || cell.mine) continue;
    cell.state = 'revealed';
    if (cell.adj === 0)
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (dr !== 0 || dc !== 0) queue.push([r + dr, c + dc]);
  }
  return b;
}

function isWon(board: Cell[][]): boolean {
  return board.every(row => row.every(cell => cell.mine || cell.state === 'revealed'));
}

function revealMines(board: Cell[][], clickedR?: number, clickedC?: number): Cell[][] {
  return board.map((row, r) =>
    row.map((cell, c) => {
      if (cell.mine && cell.state !== 'flagged') {
        const isClicked = r === clickedR && c === clickedC;
        return { ...cell, state: 'revealed' as CellState, _boom: isClicked } as Cell & { _boom?: boolean };
      }
      // Mark wrong flags
      if (!cell.mine && cell.state === 'flagged') return { ...cell, state: 'revealed' as CellState };
      return cell;
    })
  );
}

function flagAllMines(board: Cell[][]): Cell[][] {
  return board.map(row => row.map(cell => cell.mine ? { ...cell, state: 'flagged' as CellState } : cell));
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Minesweeper() {
  const [mode, setMode] = useState<Mode>('easy');
  const [board, setBoard] = useState<Cell[][]>(() => makeBoard(9, 9));
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Track the cell that triggered the boom for red highlight
  const boomCellRef = useRef<[number, number] | null>(null);

  const { rows, cols, mines, cellPx } = MODES[mode];

  useEffect(() => {
    if (phase === 'playing') {
      timerRef.current = setInterval(() => setTime(t => Math.min(t + 1, 999)), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [phase]);

  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  const reset = (m: Mode = mode) => {
    const { rows, cols } = MODES[m];
    stopTimer();
    boomCellRef.current = null;
    setBoard(makeBoard(rows, cols));
    setPhase('idle');
    setFlagCount(0);
    setTime(0);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    reset(m);
  };

  const handleClick = (r: number, c: number) => {
    if (phase === 'won' || phase === 'lost') return;
    const cell = board[r][c];
    if (cell.state === 'flagged') return;

    // Chord: click on a revealed number — reveal neighbors if flag count matches
    if (cell.state === 'revealed') {
      if (cell.adj === 0) return;
      let adjFlags = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].state === 'flagged') adjFlags++;
        }
      if (adjFlags !== cell.adj) return;

      let next = board;
      let hitMine = false;
      let boomR = -1, boomC = -1;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && next[nr][nc].state === 'hidden') {
            if (next[nr][nc].mine) { hitMine = true; boomR = nr; boomC = nc; }
            next = floodReveal(next, rows, cols, nr, nc);
          }
        }

      if (hitMine) {
        boomCellRef.current = [boomR, boomC];
        setBoard(revealMines(next, boomR, boomC));
        setPhase('lost'); stopTimer(); return;
      }
      if (isWon(next)) { setBoard(flagAllMines(next)); setPhase('won'); stopTimer(); return; }
      setBoard(next);
      return;
    }

    // Clicked a mine
    if (cell.mine) {
      boomCellRef.current = [r, c];
      setBoard(revealMines(board, r, c));
      setPhase('lost'); stopTimer(); return;
    }

    // First click: plant mines, start timer
    let activeBoard = board;
    if (phase === 'idle') {
      activeBoard = plantMines(board, rows, cols, mines, r, c);
      setPhase('playing');
    }

    const next = floodReveal(activeBoard, rows, cols, r, c);
    if (isWon(next)) { setBoard(flagAllMines(next)); setPhase('won'); stopTimer(); }
    else setBoard(next);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (phase !== 'playing') return;
    const cell = board[r][c];
    if (cell.state === 'revealed') return;

    const next = board.map(row => row.map(cell => ({ ...cell })));
    if (next[r][c].state === 'hidden') {
      next[r][c].state = 'flagged';
      setFlagCount(f => f + 1);
    } else {
      next[r][c].state = 'hidden';
      setFlagCount(f => f - 1);
    }
    setBoard(next);
  };

  const minesLeft = mines - flagCount;
  const [boomR, boomC] = boomCellRef.current ?? [-1, -1];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        padding: '20px 20px 24px',
        height: '100%',
        overflowY: 'auto',
        background: 'var(--bg-base)',
        userSelect: 'none',
      }}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Mode selector */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {(Object.keys(MODES) as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.08em',
              padding: '5px 14px',
              background: mode === m ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
              border: `1px solid ${mode === m ? 'var(--accent)' : 'rgba(var(--accent-rgb), 0.18)'}`,
              borderRadius: '3px',
              color: mode === m ? 'var(--accent)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* HUD */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          padding: '8px 18px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '15px',
            color: '#ff4444',
            minWidth: '52px',
            letterSpacing: '0.05em',
          }}
        >
          ⚑ {String(Math.max(0, minesLeft)).padStart(3, '0')}
        </span>

        <button
          onClick={() => reset()}
          title="New game"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '18px',
            lineHeight: 1,
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '3px 10px',
            color: phase === 'won' ? 'var(--accent)' : phase === 'lost' ? '#ff4444' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-muted)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
        >
          {phase === 'won' ? '★' : phase === 'lost' ? '✕' : '○'}
        </button>

        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '15px',
            color: 'var(--accent)',
            minWidth: '52px',
            textAlign: 'right',
            letterSpacing: '0.05em',
          }}
        >
          ⏱ {String(time).padStart(3, '0')}
        </span>
      </div>

      {/* Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellPx}px)`,
          gap: '2px',
          padding: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          position: 'relative',
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isBoom = r === boomR && c === boomC;
            let content = '';
            let bg = '#111111';
            let color = 'var(--text-primary)';
            let shadow = 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.35)';

            if (cell.state === 'revealed') {
              shadow = 'none';
              if (cell.mine) {
                content = '×';
                bg = isBoom ? 'rgba(255,48,48,0.25)' : 'rgba(255,48,48,0.1)';
                color = '#ff3030';
              } else {
                bg = '#0d0d0d';
                if (cell.adj > 0) {
                  content = String(cell.adj);
                  color = NUM_COLORS[cell.adj] ?? 'var(--text-primary)';
                }
              }
            } else if (cell.state === 'flagged') {
              content = '⚑';
              color = phase === 'lost' && !cell.mine ? '#ff4444' : 'var(--accent)';
            }

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                onContextMenu={e => handleRightClick(e, r, c)}
                style={{
                  width: `${cellPx}px`,
                  height: `${cellPx}px`,
                  background: bg,
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: `${Math.max(10, Math.floor(cellPx * 0.44))}px`,
                  fontWeight: cell.state === 'revealed' && cell.adj > 0 ? '700' : '400',
                  cursor: cell.state !== 'revealed' && phase !== 'won' && phase !== 'lost' ? 'pointer' : 'default',
                  padding: 0,
                  boxShadow: shadow,
                  transition: 'background 0.07s',
                }}
              >
                {content}
              </button>
            );
          })
        )}

        {/* Win / lose overlay */}
        {(phase === 'won' || phase === 'lost') && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(8,8,8,0.88)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              borderRadius: '4px',
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '28px',
                fontWeight: 700,
                color: phase === 'won' ? 'var(--accent)' : '#ff4444',
                textShadow: phase === 'won' ? 'var(--glow-md)' : '0 0 24px #ff444466',
                letterSpacing: '0.04em',
              }}
            >
              {phase === 'won' ? 'CLEARED' : 'BOOM'}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
              }}
            >
              {phase === 'won' ? `${time}s · ${mines} mines` : 'better luck next time'}
            </span>
            <button
              onClick={() => reset()}
              style={{
                marginTop: '6px',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                letterSpacing: '0.08em',
                padding: '6px 18px',
                background: 'transparent',
                border: `1px solid ${phase === 'won' ? 'var(--accent)' : '#ff4444'}`,
                borderRadius: '3px',
                color: phase === 'won' ? 'var(--accent)' : '#ff4444',
                cursor: 'pointer',
              }}
            >
              [ play again ]
            </button>
          </div>
        )}
      </div>

      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '10px',
          color: '#333',
          letterSpacing: '0.05em',
        }}
      >
        left click · right click to flag · click number to chord
      </p>
    </div>
  );
}

// src/components/hero/RetroShell.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MatrixRain } from "./MatrixRain";
import { projects } from "@/data/projects";

interface ShellLine {
  id: string;
  text: string;
  variant: "output" | "echo" | "error" | "success";
}

interface ShellOption {
  value: string;
  label: string;
  kind: "color" | "command" | "project";
}

type ResizeHandle = "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw";

const MIN_SHELL_WIDTH = 280;
const MIN_SHELL_HEIGHT = 180;

const BOOT_SEQUENCE = [
  "Initializing...",
  "Loading modules... [OK]",
  "",
  "Welcome to filipe.dev v1.0",
  "Type /help for available commands.",
];

const COMMANDS = ["/help", "/whoami", "/skills", "/color", "/clear", "/matrix", "cd", "ls"];
const COLOR_OPTIONS = ["green", "cyan", "purple", "orange", "red", "pink"];
const HOME_OPTION = {
  value: "cd home",
  label: "home",
  kind: "project" as const,
};

let lineCounter = 0;
function uid() {
  return `line-${++lineCounter}`;
}

const COLOR_PRESETS: Record<
  string,
  { accent: string; dim: string; rgb: string }
> = {
  green: { accent: "#39ff14", dim: "#39ff1466", rgb: "57, 255, 20" },
  cyan: { accent: "#00ffff", dim: "#00ffff66", rgb: "0, 255, 255" },
  purple: { accent: "#bf5fff", dim: "#bf5fff66", rgb: "191, 95, 255" },
  orange: { accent: "#ff6b00", dim: "#ff6b0066", rgb: "255, 107, 0" },
  red: { accent: "#ff2020", dim: "#ff202066", rgb: "255, 32, 32" },
  pink: { accent: "#ff2d78", dim: "#ff2d7866", rgb: "255, 45, 120" },
};

function applyColor(name: string): boolean {
  const preset = COLOR_PRESETS[name];
  if (!preset) return false;
  const root = document.documentElement;
  const hex = preset.accent;
  root.style.setProperty("--accent", hex);
  root.style.setProperty("--accent-dim", preset.dim);
  root.style.setProperty("--accent-rgb", preset.rgb);
  root.style.setProperty("--glow-sm", `0 0 8px ${hex}aa`);
  root.style.setProperty("--glow-md", `0 0 20px ${hex}66, 0 0 40px ${hex}22`);
  root.style.setProperty("--glow-lg", `0 0 40px ${hex}88, 0 0 80px ${hex}33`);
  return true;
}

export function RetroShell({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [lines, setLines] = useState<ShellLine[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [booting, setBooting] = useState(true);
  const [matrixActive, setMatrixActive] = useState(false);
  const [shellSize, setShellSize] = useState({ width: 540, height: 360 });
  const [shellOffset, setShellOffset] = useState({ x: 0, y: 0 });
  const [maximized, setMaximized] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragStartRef = useRef<{
    x: number;
    y: number;
    ox: number;
    oy: number;
  } | null>(null);
  const resizeStartRef = useRef<{
    handle: ResizeHandle;
    x: number;
    y: number;
    width: number;
    height: number;
    ox: number;
    oy: number;
  } | null>(null);

  const openProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
    onClose?.();
  };

  const openHome = () => {
    navigate("/");
    onClose?.();
  };

  const options = useMemo<ShellOption[]>(() => {
    const trimmed = inputValue.trimStart();
    if (!trimmed) {
      return [];
    }

    const projectOptions = (command: "cd" | "ls", partial = "") =>
      projects
        .filter((project) => project.id.startsWith(partial.toLowerCase()))
        .map((project) => ({
          value: `${command} ${project.id}`,
          label: project.id,
          kind: "project" as const,
        }));

    if (trimmed.startsWith("/color")) {
      const [, partial = ""] = trimmed.split(/\s+/, 2);
      return COLOR_OPTIONS.filter((color) =>
        color.startsWith(partial.toLowerCase()),
      ).map((color) => ({
        value: `/color ${color}`,
        label: color,
        kind: "color" as const,
      }));
    }
    if (trimmed.startsWith("cd")) {
      const [, partial = ""] = trimmed.split(/\s+/, 2);
      return [
        {
          value: "cd",
          label: "cd",
          kind: "command" as const,
        },
        ...("home".startsWith(partial.toLowerCase()) ? [HOME_OPTION] : []),
        ...projectOptions("cd", partial),
      ];
    }
    if ("ls".startsWith(trimmed)) {
      return [
        {
          value: "ls",
          label: "ls",
          kind: "command" as const,
        },
      ];
    }
    if (trimmed.startsWith("/")) {
      return COMMANDS.filter((command) => command.startsWith(trimmed)).map(
        (command) => ({
          value: command,
          label: command,
          kind: "command" as const,
        }),
      );
    }
    return [];
  }, [inputValue]);

  const suggestion = (() => {
    if (options.length === 0) return "";
    const selected = options[activeOptionIndex] ?? options[0];
    if (!selected || !selected.value.startsWith(inputValue)) return "";
    return selected.value === inputValue
      ? ""
      : selected.value.slice(inputValue.length);
  })();

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    BOOT_SEQUENCE.forEach((text, index) => {
      const timeout = setTimeout(
        () => {
          setLines((prev) => [...prev, { id: uid(), text, variant: "output" }]);
          if (index === BOOT_SEQUENCE.length - 1) setBooting(false);
        },
        200 + index * 350,
      );
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  function dispatch(cmd: string) {
    const parts = cmd.trim().split(/\s+/);
    const name = parts[0].toLowerCase();
    const args = parts.slice(1);

    const add = (text: string, variant: ShellLine["variant"] = "output") =>
      setLines((prev) => [...prev, { id: uid(), text, variant }]);

    switch (name) {
      case "/help":
        add("Available commands:");
        add("  /help              - show this message");
        add("  /whoami            - about me");
        add("  /skills            - tech stack");
        add("  ls                 - list projects");
        add("  cd home            - go to home");
        add("  cd <project>       - open a project");
        add("  /color <name>      - change accent color");
        add("  /clear             - clear terminal");
        add("  /matrix            - classic matrix rain");
        add("");
        add("  colors: green | cyan | purple | orange | red | pink");
        break;

      case "/whoami":
        add("Filipe - Software Engineer", "success");
        add("Builds performant systems and obsessive UIs.");
        add("From low-level Go services to browser-native experiences.");
        add("Cares deeply about the craft.");
        break;

      case "/skills":
        add("$ ls ~/skills/", "echo");
        add("Go              TypeScript      React", "success");
        add("Node.js         PostgreSQL      Redis", "success");
        add("Docker          Kubernetes      Linux", "success");
        add("Vite            Tailwind        Framer Motion", "success");
        break;

      case "cd": {
        if (args[0]?.toLowerCase() === "home") {
          add("Opening home...", "success");
          openHome();
          break;
        }

        const targetProject = projects.find(
          (project) => project.id === args[0]?.toLowerCase(),
        );

        if (!args[0]) {
          add("Usage: cd <project>", "error");
          add(`Projects: ${projects.map((project) => project.id).join(" | ")}`);
        } else if (!targetProject) {
          add(`Project "${args[0]}" not found.`, "error");
        } else {
          add(`Opening ${targetProject.id}...`, "success");
          openProject(targetProject.id);
        }
        break;
      }

      case "ls":
      case "/ls":
        add("$ ls ~/projects/", "echo");
        projects.forEach((project) => add(project.id, "success"));
        break;

      case "/clear":
        setLines([]);
        break;

      case "/matrix":
        setMatrixActive(true);
        setTimeout(() => {
          setMatrixActive(false);
          setLines((prev) => [
            ...prev,
            { id: uid(), text: "[matrix rain ended]", variant: "output" },
          ]);
        }, 2400);
        break;

      case "/color": {
        const colorName = args[0]?.toLowerCase();
        if (!colorName) {
          add("Usage: /color <name>", "error");
          add("Colors: green | cyan | purple | orange | red | pink", "output");
        } else if (!applyColor(colorName)) {
          add(
            `Unknown color "${colorName}". Options: green, cyan, purple, orange, red, pink`,
            "error",
          );
        } else {
          add(`Accent color changed to ${colorName}.`, "success");
        }
        break;
      }

      default:
        add(`bash: command not found: ${cmd}`, "error");
    }
  }

  const applyOption = (option: ShellOption, execute = false) => {
    if (
      execute &&
      option.kind === "project" &&
      inputValue.trimStart().startsWith("cd")
    ) {
      const isHome = option.label === "home";
      setCommandHistory((prev) => [option.value, ...prev]);
      setLines((prev) => [
        ...prev,
        { id: uid(), text: `> ${option.value}`, variant: "echo" },
        {
          id: uid(),
          text: isHome ? "Opening home..." : `Opening ${option.label}...`,
          variant: "success",
        },
      ]);
      setInputValue("");
      setHistoryIndex(-1);
      if (isHome) {
        openHome();
      } else {
        openProject(option.label);
      }
      return;
    }

    setInputValue(option.value);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = (options[activeOptionIndex]?.value ?? inputValue).trim();
      setInputValue("");
      setHistoryIndex(-1);
      if (!cmd) return;
      setCommandHistory((prev) => [cmd, ...prev]);
      setLines((prev) => [
        ...prev,
        { id: uid(), text: `> ${cmd}`, variant: "echo" },
      ]);
      dispatch(cmd);
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (options.length > 0) {
        applyOption(options[activeOptionIndex] ?? options[0], false);
      } else if (suggestion) {
        setInputValue(inputValue + suggestion);
      }
    } else if (e.key === "ArrowUp") {
      if (options.length > 0) {
        e.preventDefault();
        setActiveOptionIndex(
          (prev) => (prev - 1 + options.length) % options.length,
        );
        return;
      }
      e.preventDefault();
      const next = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(next);
      setInputValue(commandHistory[next] ?? "");
    } else if (e.key === "ArrowDown") {
      if (options.length > 0) {
        e.preventDefault();
        setActiveOptionIndex((prev) => (prev + 1) % options.length);
        return;
      }
      e.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setInputValue(next === -1 ? "" : commandHistory[next]);
    }
  };

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: shellOffset.x,
      oy: shellOffset.y,
    };

    const onMove = (ev: MouseEvent) => {
      if (!dragStartRef.current) return;
      const deltaX = ev.clientX - dragStartRef.current.x;
      const deltaY = ev.clientY - dragStartRef.current.y;
      setShellOffset({
        x: dragStartRef.current.ox + deltaX,
        y: dragStartRef.current.oy + deltaY,
      });
    };

    const onUp = () => {
      dragStartRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const startResize = (handle: ResizeHandle, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resizeStartRef.current = {
      handle,
      x: e.clientX,
      y: e.clientY,
      width: shellSize.width,
      height: shellSize.height,
      ox: shellOffset.x,
      oy: shellOffset.y,
    };

    const onMove = (ev: MouseEvent) => {
      if (!resizeStartRef.current) return;
      const current = resizeStartRef.current;
      const dx = ev.clientX - current.x;
      const dy = ev.clientY - current.y;

      setMaximized(false);

      let width = current.width;
      let height = current.height;
      let x = current.ox;
      let y = current.oy;

      if (current.handle.includes("e")) {
        width = Math.max(MIN_SHELL_WIDTH, current.width + dx);
      }
      if (current.handle.includes("s")) {
        height = Math.max(MIN_SHELL_HEIGHT, current.height + dy);
      }
      if (current.handle.includes("w")) {
        width = Math.max(MIN_SHELL_WIDTH, current.width - dx);
        x = current.ox + (current.width - width);
      }
      if (current.handle.includes("n")) {
        height = Math.max(MIN_SHELL_HEIGHT, current.height - dy);
        y = current.oy + (current.height - height);
      }

      setShellSize({ width, height });
      setShellOffset({ x, y });
    };

    const onUp = () => {
      resizeStartRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const resizeHandles: Array<{
    handle: ResizeHandle;
    style: React.CSSProperties;
  }> = [
    {
      handle: "n",
      style: { top: -4, left: 12, right: 12, height: 8, cursor: "ns-resize" },
    },
    {
      handle: "s",
      style: {
        bottom: -4,
        left: 12,
        right: 12,
        height: 8,
        cursor: "ns-resize",
      },
    },
    {
      handle: "e",
      style: { top: 12, right: -4, bottom: 12, width: 8, cursor: "ew-resize" },
    },
    {
      handle: "w",
      style: { top: 12, left: -4, bottom: 12, width: 8, cursor: "ew-resize" },
    },
    {
      handle: "ne",
      style: {
        top: -4,
        right: -4,
        width: 12,
        height: 12,
        cursor: "nesw-resize",
      },
    },
    {
      handle: "nw",
      style: {
        top: -4,
        left: -4,
        width: 12,
        height: 12,
        cursor: "nwse-resize",
      },
    },
    {
      handle: "se",
      style: {
        bottom: -4,
        right: -4,
        width: 12,
        height: 12,
        cursor: "nwse-resize",
      },
    },
    {
      handle: "sw",
      style: {
        bottom: -4,
        left: -4,
        width: 12,
        height: 12,
        cursor: "nesw-resize",
      },
    },
  ];

  const resetWindow = () => {
    setShellSize({ width: 540, height: 360 });
    setShellOffset({ x: 0, y: 0 });
    setMaximized(false);
  };

  const toggleMaximize = () => {
    if (maximized) {
      resetWindow();
      return;
    }
    setShellSize({ width: 760, height: 520 });
    setShellOffset({ x: -90, y: -36 });
    setMaximized(true);
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        background: "#121212",

        border: "1px solid var(--accent)",
        boxShadow: "var(--glow-sm)",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        width: `${shellSize.width}px`,
        height: `${shellSize.height}px`,
        position: "relative",
        overflow: "visible",
        cursor: "text",
        animation: "crt-flicker 6s infinite",
        transform: `translate(${shellOffset.x}px, ${shellOffset.y}px)`,
      }}
    >
      {resizeHandles.map((item) => (
        <div
          key={item.handle}
          onMouseDown={(e) => startResize(item.handle, e)}
          style={{ position: "absolute", zIndex: 14, ...item.style }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)",
          pointerEvents: "none",
          zIndex: 10,
          borderRadius: "4px",
        }}
      />

      <div
        onMouseDown={startDrag}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 12px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          background: "rgba(255,255,255,0.02)",
          cursor: "move",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            aria-label="Close terminal"
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "none",
              background: "#ff5f57",
              boxShadow: "0 0 8px rgba(255,95,87,0.35)",
              cursor: "pointer",
              padding: 0,
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetWindow();
            }}
            aria-label="Reset terminal window"
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "none",
              background: "#ffbd2e",
              boxShadow: "0 0 8px rgba(255,189,46,0.28)",
              cursor: "pointer",
              padding: 0,
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximize();
            }}
            aria-label="Expand terminal"
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              border: "none",
              background: "#28c840",
              boxShadow: "0 0 8px rgba(40,200,64,0.28)",
              cursor: "pointer",
              padding: 0,
            }}
          />
        </div>
        <span
          style={{
            color: "var(--text-muted)",
            marginLeft: "8px",
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.05em",
            flex: 1,
          }}
        >
          ~/filipe - bash
        </span>
      </div>

      <div
        ref={outputRef}
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 12px",
          borderRadius: "0 0 4px 4px",
        }}
      >
        {matrixActive ? (
          <MatrixRain />
        ) : (
          lines.map((line) => (
            <div
              key={line.id}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                lineHeight: 1.65,
                whiteSpace: "pre",
                color:
                  line.variant === "error"
                    ? "#ff4444"
                    : line.variant === "success"
                      ? "var(--accent)"
                      : line.variant === "echo"
                        ? "#888888"
                        : "var(--text-primary)",
              }}
            >
              {line.text}
            </div>
          ))
        )}
      </div>

      {!booting && !matrixActive && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <span
            style={{
              color: "var(--accent)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              marginRight: "8px",
              userSelect: "none",
            }}
          >
            &gt;
          </span>
          <div
            style={{
              flex: 1,
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              autoFocus
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setActiveOptionIndex(0);
              }}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                caretColor: "var(--accent)",
                position: "relative",
                zIndex: 1,
                width: "100%",
              }}
            />
            {suggestion && (
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: `${inputValue.length}ch`,
                  color: "#444",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  pointerEvents: "none",
                  userSelect: "none",
                  whiteSpace: "pre",
                  zIndex: 0,
                }}
              >
                {suggestion}
              </span>
            )}
          </div>
          {options.length > 0 && (
            <div
              style={{
                position: "absolute",
                left: "12px",
                right: "12px",
                bottom: "100%",
                marginBottom: "8px",
                background: "rgba(8,8,8,0.96)",
                border: "1px solid rgba(var(--accent-rgb), 0.24)",
                borderRadius: "4px",
                boxShadow: "var(--glow-sm)",
                overflow: "hidden",
                zIndex: 20,
              }}
            >
              {options.slice(0, 6).map((option, index) => {
                const active = index === activeOptionIndex;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      applyOption(option, true);
                    }}
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                      gap: "1rem",
                      background: active
                        ? "rgba(var(--accent-rgb), 0.12)"
                        : "transparent",
                      border: "none",
                      borderBottom:
                        index === Math.min(options.length, 6) - 1
                          ? "none"
                          : "1px solid rgba(var(--accent-rgb), 0.08)",
                      color: active
                        ? "var(--text-primary)"
                        : "var(--text-muted)",
                      padding: "0.5rem 0.75rem",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <span>{option.label}</span>
                    <span style={{ color: "var(--accent)" }}>
                      {option.kind}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

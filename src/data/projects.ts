export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  storeUrl?: string;
  embedUrl?: string;
  videoUrl?: string;
  images?: string[];
  icon?: string;
  privacyPolicyUrl?: string;
  featured: boolean;
  floatingPreview?: boolean;
}

const baseUrl = import.meta.env.BASE_URL;

export const projects: Project[] = [
  {
    id: "quit",
    title: "QUIT — App Blocker",
    description:
      "Android app that helps you break phone addiction by making you gamble for your own screen time. Block distracting apps, set daily limits — then bet your remaining time on BlackJack, Mines, or Roulette to earn more. Published on the Play Store.",
    longDescription:
      "QUIT flips the script on screen-time apps: instead of just locking you out, it turns your remaining daily allowance into chips. Want more time? Win it back at the table. Lose, and the apps stay blocked. Built with Flutter and Kotlin, it uses Android's AccessibilityService and overlay APIs to enforce blocks in real time. A Supabase backend handles cloud sync, friend gifting (send someone extra time), and persistent stats. Three mini-games — BlackJack, Mines, and Roulette — are built from scratch with proper RNG and bet management. The monitoring foreground service survives app kills and device restarts.",
    tags: ["Flutter", "Kotlin", "Android", "Supabase"],
    storeUrl: "https://play.google.com/store/apps/details?id=com.quitapppppp",
    images: [
      `${baseUrl}projects/quit/Main.png`,
      `${baseUrl}projects/quit/Stats.png`,
      `${baseUrl}projects/quit/BlackJack.png`,
      `${baseUrl}projects/quit/Mines.png`,
      `${baseUrl}projects/quit/Roullete.png`,
    ],
    icon: `${baseUrl}projects/quit/app_icon.png`,
    privacyPolicyUrl: `${baseUrl}privacy-quit.html`,
    featured: true,
  },
  {
    id: "procaistination",
    title: "ProcAIstination",
    description:
      "A short desktop AI experiment built to test how a playful assistant might behave on top of a real Windows workspace, with local prompts, ghost reactions, and a lightweight command layer.",
    longDescription:
      "ProcAIstination is a short Windows-focused test app built with Electron, React, and Three.js to explore how an AI desktop companion could feel in practice. The ghost floats above the desktop, reacts to context from the active workspace, and experiments with playful interventions like opening apps, surfacing memes, and answering prompts through a local Ollama model. It is intentionally lightweight and exploratory rather than production-ready, and the current portfolio preview uses a recorded demo from the real app. Natural next steps would be better context detection, safer action boundaries, stronger memory and personalization, and cleaner desktop-native UX.",
    tags: ["Electron", "React", "Three.js", "Ollama", "Desktop AI"],
    githubUrl: "https://github.com/FilipeBHenriques/mini-assistant",
    videoUrl: `${baseUrl}projects/procaistination/ghost-ai-demo.mp4`,
    icon: `${baseUrl}projects/procaistination/logo192.png`,
    featured: true,
    floatingPreview: true,
  },
  {
    id: "algo-visualizer",
    title: "Algorithm Visualizer",
    description:
      "3D maze generation and pathfinding visualizer built with React Three Fiber. Watch algorithms carve through a voxel grid in real time — switch between 2D and 3D views, tweak speed, and explore multiple generation strategies.",
    longDescription:
      "A real-time algorithm visualizer that renders maze generation and pathfinding in a fully interactive 3D scene. Built on React Three Fiber with instanced rendering for performance, it supports multiple generation algorithms (recursive backtracker, Prim's, Kruskal's) and solvers (BFS, DFS, A*). A sci-fi aesthetic with custom shaders, a settings drawer, and smooth camera controls keeps it engaging beyond the algorithm itself. Toggle between a top-down 2D schematic and a first-person 3D walkthrough of the generated maze.",
    tags: ["TypeScript", "React", "Three.js", "React Three Fiber"],
    liveUrl: "https://FilipeBHenriques.github.io/AlgoVizualizer/",
    embedUrl: "https://FilipeBHenriques.github.io/AlgoVizualizer/",
    featured: true,
    floatingPreview: true,
  },
];

export const allTags = Array.from(
  new Set(projects.flatMap((p) => p.tags)),
).sort();

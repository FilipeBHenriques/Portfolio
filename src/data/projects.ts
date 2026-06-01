export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  storeUrl?: string
  embedUrl?: string
  videoUrl?: string
  images?: string[]
  icon?: string
  privacyPolicyUrl?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'quit',
    title: 'QUIT — App Blocker',
    description: 'Android app that helps you break phone addiction by making you gamble for your own screen time. Block distracting apps, set daily limits — then bet your remaining time on BlackJack, Mines, or Roulette to earn more. Published on the Play Store.',
    longDescription: 'QUIT flips the script on screen-time apps: instead of just locking you out, it turns your remaining daily allowance into chips. Want more time? Win it back at the table. Lose, and the apps stay blocked. Built with Flutter and Kotlin, it uses Android\'s AccessibilityService and overlay APIs to enforce blocks in real time. A Supabase backend handles cloud sync, friend gifting (send someone extra time), and persistent stats. Three mini-games — BlackJack, Mines, and Roulette — are built from scratch with proper RNG and bet management. The monitoring foreground service survives app kills and device restarts.',
    tags: ['Flutter', 'Kotlin', 'Android', 'Supabase'],
    storeUrl: 'https://play.google.com/store/apps/details?id=com.yelhow.quit',
    images: [
      '/Portfolio/projects/quit/Main.png',
      '/Portfolio/projects/quit/Stats.png',
      '/Portfolio/projects/quit/BlackJack.png',
      '/Portfolio/projects/quit/Mines.png',
      '/Portfolio/projects/quit/Roullete.png',
    ],
    icon: '/Portfolio/projects/quit/app_icon.png',
    privacyPolicyUrl: '/Portfolio/privacy-quit.html',
    featured: true,
  },
  {
    id: 'algo-visualizer',
    title: 'Algorithm Visualizer',
    description: '3D maze generation and pathfinding visualizer built with React Three Fiber. Watch algorithms carve through a voxel grid in real time — switch between 2D and 3D views, tweak speed, and explore multiple generation strategies.',
    longDescription: 'A real-time algorithm visualizer that renders maze generation and pathfinding in a fully interactive 3D scene. Built on React Three Fiber with instanced rendering for performance, it supports multiple generation algorithms (recursive backtracker, Prim\'s, Kruskal\'s) and solvers (BFS, DFS, A*). A sci-fi aesthetic with custom shaders, a settings drawer, and smooth camera controls keeps it engaging beyond the algorithm itself. Toggle between a top-down 2D schematic and a first-person 3D walkthrough of the generated maze.',
    tags: ['TypeScript', 'React', 'Three.js', 'React Three Fiber'],
    liveUrl: 'https://FilipeBHenriques.github.io/AlgoVizualizer/',
    embedUrl: 'https://FilipeBHenriques.github.io/AlgoVizualizer/',
    featured: true,
  },
]

export const allTags = Array.from(
  new Set(projects.flatMap((p) => p.tags))
).sort()

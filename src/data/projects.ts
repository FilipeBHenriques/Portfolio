export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  videoUrl?: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'devshell',
    title: 'DevShell',
    description: 'A terminal multiplexer written in Go with a custom session manager, plugin system, and scriptable keybindings. Handles nested sessions, persistent history, and workspace state restoration on boot.',
    tags: ['Go', 'CLI', 'Systems'],
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 'synthwave-engine',
    title: 'SynthWave Engine',
    description: 'Browser-based synthesizer built with the Web Audio API and React. Supports polyphonic input, envelope shaping, LFO modulation, and a step sequencer. No dependencies beyond the browser.',
    tags: ['TypeScript', 'React', 'Web Audio'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: true,
  },
  {
    id: 'glitch-ui',
    title: 'Glitch UI',
    description: 'Component library with an intentional glitch aesthetic — scanlines, chromatic aberration effects, corrupt-text transitions. Built for React with zero runtime CSS-in-JS.',
    tags: ['TypeScript', 'React', 'CSS'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: false,
  },
  {
    id: 'voxel-world',
    title: 'Voxel World',
    description: 'Procedurally generated voxel terrain renderer using Three.js and custom chunk-based world management. Features cave systems, biomes, and real-time ambient occlusion.',
    tags: ['TypeScript', 'Three.js', 'Game Dev'],
    githubUrl: 'https://github.com',
    featured: false,
  },
  {
    id: 'flux-api',
    title: 'Flux API',
    description: 'Lightweight REST framework for Go with zero-allocation routing, middleware chaining, and automatic OpenAPI spec generation from struct tags. Sub-millisecond p99 latency.',
    tags: ['Go', 'API', 'Performance'],
    githubUrl: 'https://github.com',
    featured: false,
  },
  {
    id: 'neural-pixels',
    title: 'Neural Pixels',
    description: 'Real-time style transfer running in the browser via TensorFlow.js. Converts webcam feed or uploaded images with custom-trained artistic models, 12fps on modern hardware.',
    tags: ['Python', 'ML', 'TypeScript'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    featured: false,
  },
]

export const allTags = Array.from(
  new Set(projects.flatMap((p) => p.tags))
).sort()

# Portfolio Website — Design Spec
**Date:** 2026-04-08
**Status:** Approved

---

## Overview

A personal portfolio website for a Software Engineer. Dark mode first, cyberpunk-minimalist aesthetic with phosphor green accents. Built with Vite + React + TypeScript, shadcn/ui, framer-motion, Tailwind CSS. Deployable to Cloudflare Pages via static build.

Two pages: a landing page (`/`) with hero + bottom drawer projects carousel, and a projects page (`/projects`) with a bento/masonry grid.

---

## Stack

- **Framework:** Vite + React + TypeScript
- **Router:** React Router v6
- **UI primitives:** shadcn/ui
- **Animation:** framer-motion
- **Styling:** Tailwind CSS + CSS custom properties
- **Fonts:** Space Grotesk (display), Inter (body), JetBrains Mono (mono accents)
- **Deployment target:** Cloudflare Pages (static output, no adapter needed)

---

## Architecture & Folder Structure

```
portfolio/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn primitives (Button, Card, etc.)
│   │   ├── layout/          # Navbar, PageWrapper
│   │   ├── hero/            # HeroSection, HeroBackground, HeroText
│   │   ├── drawer/          # ProjectsDrawer, DrawerHandle, ProjectCarousel
│   │   └── projects/        # ProjectCard, ProjectGrid, ProjectModal, TagFilter
│   ├── pages/
│   │   ├── Home.tsx
│   │   └── Projects.tsx
│   ├── data/
│   │   └── projects.ts      # Typed project entries (all placeholder)
│   ├── hooks/
│   │   └── useDrawer.ts
│   ├── lib/
│   │   ├── cn.ts            # className utility
│   │   └── motionVariants.ts
│   └── styles/
│       └── globals.css
```

**Adding a new project:** Add one object to `src/data/projects.ts`. Nothing else to touch.

---

## Data Model

```ts
interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
  videoUrl?: string
  featured: boolean  // featured = larger bento cell
}
```

Placeholder data: 6 projects, 2 featured, varied tags (TypeScript, React, Go, Game Dev, etc.).

---

## Design System

### Color Tokens
```css
--bg-base:      #080808   /* near-black base */
--bg-surface:   #111111   /* card/panel surfaces */
--bg-elevated:  #1a1a1a   /* elevated surfaces, modals */
--accent:       #39ff14   /* phosphor green — used sparingly */
--accent-dim:   #39ff1466 /* dimmed accent for glows */
--text-primary: #f0f0f0
--text-muted:   #666666
--border:       #222222
```

### Glow Scale
- `glow-sm`:  `0 0 8px #39ff14aa` — hover state
- `glow-md`:  `0 0 20px #39ff1466, 0 0 40px #39ff1422` — card focus
- `glow-lg`:  `0 0 40px #39ff1488, 0 0 80px #39ff1433` — hero elements

### Typography
- `Space Grotesk` — headings, display text
- `Inter` — body copy
- `JetBrains Mono` — tags, code labels, monospace accents

### Motion Principles (framer-motion)
- **Page entry:** fade-up (`y: 20→0`, `opacity: 0→1`, `duration: 0.6`)
- **Hover:** scale `1→1.02` + glow intensifies (`duration: 0.2`, ease: easeOut)
- **Drawer open/close:** spring (`stiffness: 300, damping: 30`)
- **Grid stagger:** `staggerChildren: 0.08`
- **Card morph to modal:** shared `layoutId` for position-aware transition
- **Tag filter reflow:** `AnimatePresence` + `layout` prop on cards
- No scroll-triggered parallax on content — background only, subtle

---

## Page: Landing (`/`)

### Navbar
- Fixed top, full-width
- Left: monospace name — `> filipe.dev`
- Right: `Projects` nav link, green underline on hover
- Transparent background with subtle backdrop blur

### Hero Section
- Full viewport height (`100vh`), content centered
- **Heading:** `"Hi, I'm [Name]"` — large display, bold, phosphor green blinking cursor on last character
- **Sub-line:** `"Software Engineer"` — muted, smaller
- **Bio:** 1–2 sentence placeholder paragraph
- **CTAs:** `"View Projects"` (accent border + glow, opens drawer) + `"GitHub"` (ghost button)
- **Background:**
  - Perspective grid — thin dark lines, very low opacity (~5%), static SVG or CSS
  - Radial glow from center — extremely diffuse phosphor green, opacity ~8%
  - No particles, no canvas animations

### Bottom Drawer
- **Handle:** always visible 40px strip at bottom of viewport
  - Faint phosphor green top border
  - Centered pull indicator: `▲ Projects` in mono text
- **Triggers:** handle click OR "View Projects" hero CTA button
- **Open state:** slides up to 65% viewport height (spring animation)
- **Contents:**
  - Section label + horizontally scrollable `ProjectCarousel`
  - Cards: `280×340px`, dark surface, title, tags, short description
  - Hover: glow border + `translateY(-4px)` lift
  - Carousel: momentum scroll, no scrollbar, fade masks on left/right edges
- **Close:** click handle, click outside drawer, or `Esc`
- **State managed by:** `useDrawer` hook

---

## Page: Projects (`/projects`)

### Page Header
- Left-aligned: `"Projects"` in large display, muted sub-label `"Things I've built"`
- Same navbar as homepage

### Bento/Masonry Grid
- CSS grid, `auto-rows`, max-width `1200px`, centered
- Featured projects: `col-span-2` or `row-span-2`
- Non-featured: standard `1×1` cells

### ProjectCard
- Background: `--bg-surface`, `1px` border `--border`
- Top: video/image placeholder (gradient block + play icon)
- Bottom: title, tag pills (mono, small, green tint), description excerpt
- **Hover:** border → accent, `glow-md`, `translateY(-4px)`, placeholder brightens, icon buttons (GitHub, live) fade in
- **Click:** opens ProjectModal

### Tag Filter Bar
- Horizontally scrollable pill row above grid
- Active pill: accent background
- Filtering: `AnimatePresence` + `layout` on cards — smooth reflow, no jump

### ProjectModal
- Full-screen overlay on card click
- Video embed area (placeholder `<iframe>`)
- Full description, all tags, external links
- Entry animation: morphs from card position using shared `layoutId`
- Close: `Esc` or backdrop click

---

## Routing

| Path | Component |
|---|---|
| `/` | `Home.tsx` |
| `/projects` | `Projects.tsx` |

No lazy loading — both pages are small, instant load acceptable.

---

## Cloudflare Pages Readiness

- `vite build` outputs static files to `dist/`
- No SSR, no adapter needed
- Add `_redirects` file in `public/` for SPA fallback: `/* /index.html 200`

---

## Out of Scope (this iteration)

- Real project content (all placeholder)
- Contact form / email integration
- Blog / writing section
- Authentication
- CMS integration

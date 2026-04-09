import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Projects } from '@/pages/Projects'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { Games } from '@/pages/Games'
import { Progression } from '@/pages/Progression'
import { ShellPortal } from '@/components/hero/ShellPortal'
import '@/styles/globals.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/games" element={<Games />} />
        <Route path="/progression" element={<Progression />} />
      </Routes>
      <ShellPortal />
    </BrowserRouter>
  )
}

import { PageWrapper } from '@/components/layout/PageWrapper'
import { HeroSection } from '@/components/hero/HeroSection'
import { ProjectsDrawer } from '@/components/drawer/ProjectsDrawer'
import { useDrawer } from '@/hooks/useDrawer'

export function Home() {
  const { isOpen, open, close, toggle } = useDrawer()

  return (
    <PageWrapper>
      <HeroSection onViewProjects={open} />
      <ProjectsDrawer isOpen={isOpen} onClose={close} onToggle={toggle} />
    </PageWrapper>
  )
}

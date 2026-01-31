import type { Mode } from '@/lib/theme-colors'

export interface Project {
  id: string
  title: string
  description: string
  image?: string
  video?: string
  technologies: string[]
  category: string[]
  modes: string[]
  featured?: boolean
  link?: string
  github?: string
}

export interface VideoModalState {
  isOpen: boolean
  videoUrl: string | null
  originRect: { x: number; y: number; width: number; height: number } | null
}

export type PortalStage = 'closed' | 'expanding' | 'open'

export interface LiquidColors {
  primary: string
  secondary: string
  bg: string
}

export interface ProjectsContextType {
  mode: Mode
  filteredProjects: Project[]
  activeIndex: number
  setActiveIndex: (index: number) => void
  liquidColors: LiquidColors
  openVideoModal: (videoUrl: string, buttonElement: HTMLButtonElement) => void
}

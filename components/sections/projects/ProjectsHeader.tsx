'use client'

import { motion } from 'framer-motion'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Mode } from '@/lib/theme-colors'
import { getAccentGradient, getLiquidColors } from '@/lib/theme-colors'
import type { Project } from './types'

interface ProjectsHeaderProps {
  mode: Mode
  filteredProjects: Project[]
  activeIndex: number
  isMobile: boolean
  containerRef: React.RefObject<HTMLDivElement>
}

export default function ProjectsHeader({
  mode,
  filteredProjects,
  activeIndex,
  isMobile,
  containerRef
}: ProjectsHeaderProps) {
  const liquidColors = getLiquidColors(mode)
  const projectCount = filteredProjects.length

  const handleDotClick = (index: number) => {
    if (containerRef.current) {
      const targetScroll = containerRef.current.offsetTop + (index * window.innerHeight)
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-24 md:pt-32 pb-8 md:pb-12">
      <div className="projects-section-title relative z-10">
        <h2 className="text-[14vw] md:text-[10vw] font-black leading-none tracking-tighter opacity-[0.02] absolute -top-4 left-0 w-full select-none pointer-events-none">
          WORK
        </h2>
        <div className="flex flex-col gap-4 md:gap-6 relative">
          <div className="flex flex-wrap items-end gap-3 md:gap-4">
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white">
              Selected
            </h2>
            <span className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light italic bg-gradient-to-r ${getAccentGradient(mode)} bg-clip-text text-transparent`}>
              Works
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-white/50 text-sm md:text-base max-w-md">
              A curated collection of projects showcasing problem-solving through code and design.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/40">
                {mode ? `${mode.toUpperCase()}` : 'ALL'}
              </span>
              <span
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                  boxShadow: `0 4px 20px ${liquidColors.primary}40`
                }}
              >
                {projectCount} Project{projectCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <nav
        className="flex items-center justify-center gap-2 mt-8 md:mt-10"
        role="tablist"
        aria-label="Project navigation"
      >
        {filteredProjects.map((project, index) => (
          <button
            key={project.id}
            onClick={() => handleDotClick(index)}
            className="transition-all duration-500 rounded-full"
            style={{
              width: index === activeIndex ? '32px' : '8px',
              height: '8px',
              background: index === activeIndex
                ? `linear-gradient(90deg, ${liquidColors.primary}, ${liquidColors.secondary})`
                : 'rgba(255,255,255,0.2)',
              boxShadow: index === activeIndex ? `0 0 20px ${liquidColors.primary}60` : 'none'
            }}
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to project ${index + 1}: ${project.title}`}
            aria-controls={`project-${project.id}`}
          />
        ))}
      </nav>

      {/* Scroll/Swipe hint */}
      <motion.div
        className="flex flex-col items-center gap-2 mt-6 text-white/30"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-[10px] tracking-widest uppercase">
          {isMobile ? 'Swipe to explore' : 'Scroll to explore'}
        </span>
        {isMobile ? (
          <div className="flex items-center gap-2" aria-hidden="true">
            <ChevronLeft className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
          </div>
        ) : (
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        )}
      </motion.div>
    </div>
  )
}

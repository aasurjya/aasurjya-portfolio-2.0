'use client'

import { useCallback } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import Image from 'next/image'
import { Github, ArrowUpRight } from 'lucide-react'
import type { Mode } from '@/lib/theme-colors'
import { getLiquidColors } from '@/lib/theme-colors'
import { THRESHOLDS, SPRINGS } from '@/lib/animation-constants'
import type { Project } from './types'

interface MobileSwipeCarouselProps {
  mode: Mode
  filteredProjects: Project[]
  activeIndex: number
  isAnimating: boolean
  exitDirection: 'left' | 'right' | null
  onSwipe: (direction: 'left' | 'right') => void
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void
  onVideoClick: (videoUrl: string, buttonElement: HTMLButtonElement) => void
}

export default function MobileSwipeCarousel({
  mode,
  filteredProjects,
  activeIndex,
  isAnimating,
  exitDirection,
  onSwipe,
  onDragEnd,
  onVideoClick
}: MobileSwipeCarouselProps) {
  const liquidColors = getLiquidColors(mode)
  const projectCount = filteredProjects.length
  const cardBg = liquidColors.bg

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="relative w-full max-w-lg h-[60vh] max-h-[600px]">
        {/* Card Stack */}
        {filteredProjects.map((project, index) => {
          // Only render current, previous, and next cards for performance
          if (Math.abs(index - activeIndex) > 2) return null

          const isActive = index === activeIndex
          const isPrev = index < activeIndex
          const offset = index - activeIndex

          return (
            <motion.div
              key={project.id}
              className="absolute inset-0 touch-none"
              style={{
                zIndex: projectCount - Math.abs(offset),
                pointerEvents: isActive ? 'auto' : 'none',
              }}
              initial={false}
              animate={{
                scale: isActive ? 1 : 1 - Math.abs(offset) * 0.05,
                y: isActive ? 0 : offset * 15,
                x: isPrev ? (exitDirection === 'right' ? 0 : -400) : (exitDirection === 'left' && isActive ? -400 : 0),
                opacity: Math.abs(offset) > 1 ? 0 : 1 - Math.abs(offset) * 0.3,
                rotateZ: isActive ? 0 : offset * 2,
              }}
              transition={SPRINGS.normal}
              drag={isActive ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={THRESHOLDS.dragElastic}
              onDragEnd={onDragEnd}
              whileDrag={{ cursor: 'grabbing' }}
              role="tabpanel"
              id={`project-${project.id}`}
              aria-label={project.title}
              aria-hidden={!isActive}
            >
              {/* Card */}
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden"
                style={{
                  backgroundColor: cardBg,
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.06),
                    0 20px 50px -15px rgba(0, 0, 0, 0.7),
                    inset 0 1px 0 rgba(255,255,255,0.05)
                  `
                }}
              >
                {/* Image Background */}
                <div className="absolute inset-0">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 600px) 100vw, 600px"
                      priority={index === activeIndex}
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        background: `
                          radial-gradient(ellipse 100% 100% at 70% 30%, ${liquidColors.primary}15 0%, transparent 50%),
                          radial-gradient(ellipse 80% 80% at 30% 70%, ${liquidColors.secondary}10 0%, transparent 50%),
                          linear-gradient(135deg, ${cardBg} 0%, ${liquidColors.primary}08 100%)
                        `
                      }}
                    />
                  )}
                  {/* Gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top,
                        ${cardBg} 0%,
                        ${cardBg}f5 25%,
                        ${cardBg}aa 45%,
                        transparent 70%
                      )`
                    }}
                  />
                </div>

                {/* Swipe indicators */}
                {isActive && (
                  <>
                    <motion.div
                      className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs font-bold"
                      initial={{ opacity: 0 }}
                      style={{ opacity: 0 }}
                      aria-hidden="true"
                    >
                      PREV
                    </motion.div>
                    <motion.div
                      className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-green-500/80 text-white text-xs font-bold"
                      initial={{ opacity: 0 }}
                      style={{ opacity: 0 }}
                      aria-hidden="true"
                    >
                      NEXT
                    </motion.div>
                  </>
                )}

                {/* Video Play Button */}
                {project.video && isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onVideoClick(project.video!, e.currentTarget)
                    }}
                    data-track-event="project_video_play"
                    data-track-target={project.title}
                    data-track-meta-projectid={project.id}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 z-10 video-play-btn"
                    style={{
                      background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                      boxShadow: `0 8px 32px ${liquidColors.primary}50`
                    }}
                    aria-label={`Play video for ${project.title}`}
                  >
                    <Play className="w-7 h-7 text-white ml-1" fill="white" aria-hidden="true" />
                  </button>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className="text-2xl font-black"
                      style={{
                        background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.category.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full"
                          style={{
                            background: `${liquidColors.primary}20`,
                            border: `1px solid ${liquidColors.primary}40`,
                            color: liquidColors.primary
                          }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-white">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 text-[10px] rounded-full text-white/60 font-medium"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="text-xs text-white/40">+{project.technologies.length - 3}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track-event="project_link_click"
                        data-track-target={project.title}
                        data-track-meta-linktype="live"
                        data-track-meta-url={project.link}
                        className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-white font-semibold text-sm"
                        style={{
                          background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View ${project.title} live`}
                      >
                        View Live
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track-event="project_link_click"
                        data-track-target={project.title}
                        data-track-meta-linktype="github"
                        data-track-meta-url={project.github}
                        className="h-11 w-11 flex items-center justify-center rounded-xl"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: `1px solid ${liquidColors.primary}30`
                        }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`View ${project.title} source code on GitHub`}
                      >
                        <Github className="w-5 h-5 text-white" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* Navigation buttons */}
        <div className="absolute -bottom-16 left-0 right-0 flex items-center justify-center gap-4">
          <button
            onClick={() => onSwipe('right')}
            disabled={activeIndex === 0 || isAnimating}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6 text-white" aria-hidden="true" />
          </button>

          {/* Counter */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(0,0,0,0.5)',
              border: `1px solid ${liquidColors.primary}30`,
            }}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="font-bold" style={{ color: liquidColors.primary }}>
              {String(activeIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-white/30" aria-hidden="true">/</span>
            <span className="text-white/50">{String(projectCount).padStart(2, '0')}</span>
            <span className="sr-only">
              Project {activeIndex + 1} of {projectCount}
            </span>
          </div>

          <button
            onClick={() => onSwipe('left')}
            disabled={activeIndex === projectCount - 1 || isAnimating}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
            style={{
              background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
            }}
            aria-label="Next project"
          >
            <ChevronRight className="w-6 h-6 text-white" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

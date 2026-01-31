'use client'

import { useRef, useEffect, memo } from 'react'
import Image from 'next/image'
import { Github, ArrowUpRight, Play } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import type { Mode } from '@/lib/theme-colors'
import { getLiquidColors } from '@/lib/theme-colors'
import { SCROLL, EASINGS } from '@/lib/animation-constants'
import type { Project } from './types'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface DesktopStackedCardsProps {
  mode: Mode
  filteredProjects: Project[]
  activeIndex: number
  setActiveIndex: (index: number) => void
  containerRef: React.RefObject<HTMLDivElement>
  onVideoClick: (videoUrl: string, buttonElement: HTMLButtonElement) => void
}

function DesktopStackedCards({
  mode,
  filteredProjects,
  activeIndex,
  setActiveIndex,
  containerRef,
  onVideoClick
}: DesktopStackedCardsProps) {
  const stickyRef = useRef<HTMLDivElement>(null)
  // Use ref to track current index without causing re-renders
  const activeIndexRef = useRef(activeIndex)
  const liquidColors = getLiquidColors(mode)
  const projectCount = filteredProjects.length
  const cardBg = liquidColors.bg

  // Sync ref with prop
  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  // Desktop scroll animation
  useEffect(() => {
    if (!containerRef.current || !stickyRef.current) return

    const cards = gsap.utils.toArray<HTMLElement>('.stacked-project-card')
    if (cards.length === 0) return

    const totalCards = cards.length

    // Throttled setActiveIndex to prevent excessive re-renders
    let lastSetIndex = -1
    const throttledSetIndex = (index: number) => {
      if (index !== lastSetIndex) {
        lastSetIndex = index
        setActiveIndex(index)
      }
    }

    const ctx = gsap.context(() => {
      // Title Animation
      gsap.from('.projects-section-title', {
        scrollTrigger: {
          trigger: '.projects-section-title',
          start: 'top 85%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: EASINGS.smooth
      })

      // Set initial card positions - all stacked with first on top
      cards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: totalCards - i,
          y: i * SCROLL.cardYOffset,
          scale: 1 - i * SCROLL.cardScaleOffset,
          force3D: true,
        })
      })

      // Animate cards on scroll - use single ScrollTrigger for better performance
      cards.forEach((card, i) => {
        if (i === totalCards - 1) return // Last card stays

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: () => `top+=${i * window.innerHeight} top`,
          end: () => `top+=${(i + 1) * window.innerHeight} top`,
          scrub: 1, // Smoother scrub value
          invalidateOnRefresh: true,
          onEnter: () => throttledSetIndex(i),
          onEnterBack: () => throttledSetIndex(i),
          onLeave: () => throttledSetIndex(Math.min(i + 1, totalCards - 1)),
          animation: gsap.to(card, {
            y: -window.innerHeight,
            scale: 0.9,
            ease: EASINGS.none,
            force3D: true,
          })
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [filteredProjects, containerRef, setActiveIndex])

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${projectCount * 100}vh` }}
    >
      {/* Sticky Card Stack */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full flex items-center justify-center"
        style={{ clipPath: 'inset(0)' }}
      >
        <div
          className="relative w-full mx-auto px-4 sm:px-6 lg:px-10"
          style={{
            maxWidth: '1400px',
            height: 'min(calc(100vh - 100px), 800px)',
          }}
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="stacked-project-card absolute inset-0"
              style={{
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                contain: 'layout style paint',
              }}
              role="tabpanel"
              id={`project-${project.id}`}
              aria-label={project.title}
            >
              {/* Card */}
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: cardBg,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255,255,255,0.06)',
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
                      sizes="(max-width: 1400px) 100vw, 1400px"
                      priority={index === 0}
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
                  {/* Desktop gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to right,
                        ${cardBg} 0%,
                        ${cardBg}f5 25%,
                        ${cardBg}cc 40%,
                        ${cardBg}66 55%,
                        transparent 75%
                      )`
                    }}
                  />
                </div>

                {/* Static aurora gradient - no animations, GPU composited */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(ellipse 80% 60% at 75% 20%, ${liquidColors.primary}25 0%, transparent 50%),
                      radial-gradient(ellipse 60% 50% at 85% 60%, ${liquidColors.secondary}20 0%, transparent 50%),
                      radial-gradient(ellipse 50% 40% at 65% 80%, ${liquidColors.primary}15 0%, transparent 50%)
                    `,
                    contain: 'strict',
                  }}
                />

                {/* Large decorative number */}
                <div className="absolute top-6 right-8 z-10 pointer-events-none">
                  <span
                    className="text-[140px] lg:text-[180px] font-black leading-none select-none"
                    style={{
                      color: 'white',
                      opacity: 0.12,
                    }}
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Video Play Button - Desktop */}
                {project.video && (
                  <button
                    onClick={(e) => onVideoClick(project.video!, e.currentTarget)}
                    className={`absolute top-1/2 right-[20%] -translate-y-1/2 ${mode === 'xr' ? 'w-24 h-24' : 'w-20 h-20'} rounded-full flex items-center justify-center transition-transform hover:scale-110 z-20 group video-play-btn`}
                    style={{
                      background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                      boxShadow: `0 8px 32px ${liquidColors.primary}40`,
                      contain: 'layout paint',
                    }}
                    aria-label={`Play video for ${project.title}`}
                  >
                    {/* Inner ring - static, no animation */}
                    {mode === 'xr' && (
                      <span
                        className="absolute inset-2 rounded-full border-2 border-white/30"
                        aria-hidden="true"
                      />
                    )}
                    <Play className={`${mode === 'xr' ? 'w-10 h-10' : 'w-8 h-8'} text-white ml-1`} fill="white" aria-hidden="true" />
                  </button>
                )}

                {/* Content */}
                <div className="relative h-full flex flex-col justify-center p-8 lg:p-12 max-w-[55%]">
                  {/* Category row */}
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="text-4xl font-black"
                      style={{
                        background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div
                      className="h-px flex-1 max-w-[60px]"
                      style={{ background: `linear-gradient(90deg, ${liquidColors.primary}50, transparent)` }}
                      aria-hidden="true"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {project.category.slice(0, 2).map((cat) => (
                        <span
                          key={cat}
                          className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full"
                          style={{
                            background: `${liquidColors.primary}25`,
                            border: `1px solid ${liquidColors.primary}30`,
                            color: liquidColors.primary
                          }}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                    {project.featured && (
                      <span
                        className="px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-full text-white"
                        style={{
                          background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                          boxShadow: `0 4px 15px ${liquidColors.primary}40`
                        }}
                        aria-label="Featured project"
                      >
                        ★
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-3 leading-[1.05] text-white">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/70 text-base lg:text-lg leading-relaxed mb-5 line-clamp-3 max-w-xl">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs rounded-full text-white/70 font-medium"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="text-sm text-white/40">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 h-12 rounded-full text-white font-semibold text-sm transition-opacity hover:opacity-90"
                        style={{
                          background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                        }}
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
                        className="inline-flex items-center gap-2 px-6 h-12 rounded-full text-white font-medium text-sm transition-colors hover:bg-white/15"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: `1px solid ${liquidColors.primary}30`
                        }}
                        aria-label={`View ${project.title} source code on GitHub`}
                      >
                        <Github className="w-4 h-4" aria-hidden="true" />
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Counter - use solid bg instead of backdrop-blur for performance */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-base font-mono px-5 py-2.5 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.85)',
            border: `1px solid ${liquidColors.primary}20`,
            contain: 'layout paint',
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          <span
            className="font-bold text-lg"
            style={{ color: liquidColors.primary }}
          >
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-white/20" aria-hidden="true">/</span>
          <span className="text-white/50">{String(projectCount).padStart(2, '0')}</span>
          <span className="sr-only">
            Project {activeIndex + 1} of {projectCount}
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(DesktopStackedCards)

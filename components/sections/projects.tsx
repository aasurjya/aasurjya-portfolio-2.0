'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { projects } from '@/lib/content-data'
import { Github, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Hook to detect mobile/tablet
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

export default function Projects() {
  const { mode } = useMode()
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const isMobile = useIsMobile()

  // Swipe state for mobile
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Video modal state
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; videoUrl: string | null }>({
    isOpen: false,
    videoUrl: null
  })

  const openVideoModal = (videoUrl: string) => {
    setVideoModal({ isOpen: true, videoUrl })
  }

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, videoUrl: null })
  }

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('vimeo.com')) {
      return `${url}?autoplay=1&title=0&byline=0&portrait=0`
    } else if (url.includes('youtube.com')) {
      return `${url}?autoplay=1&rel=0`
    }
    return url
  }

  const filteredProjects = mode
    ? projects.filter(p => p.modes.includes(mode))
    : projects
  const projectCount = filteredProjects.length

  // Swipe handlers for mobile
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (isAnimating) return

    if (direction === 'left' && activeIndex < projectCount - 1) {
      setIsAnimating(true)
      setExitDirection('left')
      setTimeout(() => {
        setActiveIndex(prev => prev + 1)
        setExitDirection(null)
        setIsAnimating(false)
      }, 300)
    } else if (direction === 'right' && activeIndex > 0) {
      setIsAnimating(true)
      setExitDirection('right')
      setTimeout(() => {
        setActiveIndex(prev => prev - 1)
        setExitDirection(null)
        setIsAnimating(false)
      }, 300)
    }
  }, [activeIndex, projectCount, isAnimating])

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100
    const velocity = 500

    if (info.offset.x < -threshold || info.velocity.x < -velocity) {
      handleSwipe('left')
    } else if (info.offset.x > threshold || info.velocity.x > velocity) {
      handleSwipe('right')
    }
  }, [handleSwipe])

  // Desktop scroll animation
  useEffect(() => {
    if (isMobile || !containerRef.current || !stickyRef.current) return

    const cards = gsap.utils.toArray<HTMLElement>('.stacked-project-card')
    if (cards.length === 0) return

    const totalCards = cards.length

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
        ease: 'power3.out'
      })

      // Animate liquid blobs
      gsap.to('.liquid-blob-1', {
        x: 100,
        y: -50,
        scale: 1.2,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
      gsap.to('.liquid-blob-2', {
        x: -80,
        y: 60,
        scale: 0.9,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // Set initial card positions - all stacked with first on top
      cards.forEach((card, i) => {
        gsap.set(card, {
          zIndex: totalCards - i,
          y: i * 10,
          scale: 1 - i * 0.02,
          force3D: true,
        })
      })

      // Animate cards on scroll using timeline for smoother performance
      cards.forEach((card, i) => {
        if (i === totalCards - 1) return // Last card stays

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: () => `top+=${i * window.innerHeight} top`,
            end: () => `top+=${(i + 1) * window.innerHeight} top`,
            scrub: 0.8, // Smooth scrubbing with slight delay
            invalidateOnRefresh: true,
            onEnter: () => setActiveIndex(i),
            onEnterBack: () => setActiveIndex(i),
            onLeave: () => setActiveIndex(Math.min(i + 1, totalCards - 1)),
          }
        })

        tl.to(card, {
          y: -window.innerHeight,
          scale: 0.9,
          ease: 'none',
          force3D: true,
        })
      })

    }, containerRef)

    return () => ctx.revert()
  }, [filteredProjects, isMobile])

  // Color system
  const getAccentGradient = () => {
    switch (mode) {
      case 'phd': return 'from-sky-400 via-blue-500 to-indigo-500'
      case 'xr': return 'from-emerald-400 via-teal-500 to-cyan-500'
      case 'fullstack': return 'from-violet-400 via-purple-500 to-indigo-500'
      default: return 'from-cyan-400 via-blue-500 to-violet-500'
    }
  }

  const getLiquidColors = () => {
    switch (mode) {
      case 'phd': return { primary: '#0ea5e9', secondary: '#6366f1', bg: '#030712' }
      case 'xr': return { primary: '#10b981', secondary: '#06b6d4', bg: '#021a1a' }
      case 'fullstack': return { primary: '#8b5cf6', secondary: '#6366f1', bg: '#0a0515' }
      default: return { primary: '#22d3ee', secondary: '#818cf8', bg: '#030708' }
    }
  }

  const liquidColors = getLiquidColors()
  const getCardBg = () => liquidColors.bg

  return (
    <section id="projects" className="relative">
      {/* Liquid Background - Animated Blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="liquid-blob-1 absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
          style={{ background: `radial-gradient(circle, ${liquidColors.primary}40 0%, transparent 70%)` }}
        />
        <div
          className="liquid-blob-2 absolute bottom-1/4 -right-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-25"
          style={{ background: `radial-gradient(circle, ${liquidColors.secondary}35 0%, transparent 70%)` }}
        />
      </div>

      {/* Header - Outside scroll container */}
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
              <span className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light italic bg-gradient-to-r ${getAccentGradient()} bg-clip-text text-transparent`}>
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
        <div className="flex items-center justify-center gap-2 mt-8 md:mt-10">
          {filteredProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (containerRef.current) {
                  const targetScroll = containerRef.current.offsetTop + (index * window.innerHeight)
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' })
                }
              }}
              className="transition-all duration-500 rounded-full"
              style={{
                width: index === activeIndex ? '32px' : '8px',
                height: '8px',
                background: index === activeIndex
                  ? `linear-gradient(90deg, ${liquidColors.primary}, ${liquidColors.secondary})`
                  : 'rgba(255,255,255,0.2)',
                boxShadow: index === activeIndex ? `0 0 20px ${liquidColors.primary}60` : 'none'
              }}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

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
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
            </div>
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </motion.div>
      </div>

      {/* Mobile/Tablet: Tinder-style Swipe Cards */}
      {isMobile ? (
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
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  drag={isActive ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.9}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ cursor: 'grabbing' }}
                >
                  {/* Card */}
                  <div
                    className="relative w-full h-full rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: getCardBg(),
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
                          sizes="100vw"
                          priority={index === activeIndex}
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            background: `
                              radial-gradient(ellipse 100% 100% at 70% 30%, ${liquidColors.primary}15 0%, transparent 50%),
                              radial-gradient(ellipse 80% 80% at 30% 70%, ${liquidColors.secondary}10 0%, transparent 50%),
                              linear-gradient(135deg, ${getCardBg()} 0%, ${liquidColors.primary}08 100%)
                            `
                          }}
                        />
                      )}
                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top,
                            ${getCardBg()} 0%,
                            ${getCardBg()}f5 25%,
                            ${getCardBg()}aa 45%,
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
                        >
                          PREV
                        </motion.div>
                        <motion.div
                          className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-green-500/80 text-white text-xs font-bold"
                          initial={{ opacity: 0 }}
                          style={{ opacity: 0 }}
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
                          openVideoModal(project.video!)
                        }}
                        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 z-10"
                        style={{
                          background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                          boxShadow: `0 8px 32px ${liquidColors.primary}50`
                        }}
                      >
                        <Play className="w-7 h-7 text-white ml-1" fill="white" />
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
                            className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl text-white font-semibold text-sm"
                            style={{
                              background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Live
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-11 w-11 flex items-center justify-center rounded-xl"
                            style={{
                              background: 'rgba(255,255,255,0.08)',
                              border: `1px solid ${liquidColors.primary}30`
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-5 h-5 text-white" />
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
                onClick={() => handleSwipe('right')}
                disabled={activeIndex === 0 || isAnimating}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              {/* Counter */}
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${liquidColors.primary}30`,
                }}
              >
                <span className="font-bold" style={{ color: liquidColors.primary }}>
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-white/30">/</span>
                <span className="text-white/50">{String(projectCount).padStart(2, '0')}</span>
              </div>

              <button
                onClick={() => handleSwipe('left')}
                disabled={activeIndex === projectCount - 1 || isAnimating}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                style={{
                  background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                }}
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop: Scroll-based stacked cards */
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
                  }}
                >
                  {/* Card */}
                  <div
                    className="relative w-full h-full rounded-3xl overflow-hidden"
                    style={{
                      backgroundColor: getCardBg(),
                      boxShadow: `
                        0 0 0 1px rgba(255,255,255,0.06),
                        0 40px 80px -20px rgba(0, 0, 0, 0.8),
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
                          sizes="100vw"
                          priority={index === 0}
                        />
                      ) : (
                        <div
                          className="w-full h-full"
                          style={{
                            background: `
                              radial-gradient(ellipse 100% 100% at 70% 30%, ${liquidColors.primary}15 0%, transparent 50%),
                              radial-gradient(ellipse 80% 80% at 30% 70%, ${liquidColors.secondary}10 0%, transparent 50%),
                              linear-gradient(135deg, ${getCardBg()} 0%, ${liquidColors.primary}08 100%)
                            `
                          }}
                        />
                      )}
                      {/* Desktop gradient overlay */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to right,
                            ${getCardBg()} 0%,
                            ${getCardBg()}f5 25%,
                            ${getCardBg()}cc 40%,
                            ${getCardBg()}66 55%,
                            transparent 75%
                          )`
                        }}
                      />
                    </div>

                    {/* Large decorative number */}
                    <div className="absolute top-6 right-8 z-10 pointer-events-none">
                      <span
                        className="text-[140px] lg:text-[180px] font-black leading-none"
                        style={{
                          background: `linear-gradient(135deg, ${liquidColors.primary}08, ${liquidColors.secondary}05)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          opacity: 0.6
                        }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Video Play Button - Desktop */}
                    {project.video && (
                      <button
                        onClick={() => openVideoModal(project.video!)}
                        className="absolute top-1/2 right-[20%] -translate-y-1/2 w-20 h-20 rounded-full flex items-center justify-center transition-all hover:scale-110 z-20 group"
                        style={{
                          background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                          boxShadow: `0 8px 40px ${liquidColors.primary}50`
                        }}
                      >
                        <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform" fill="white" />
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
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div
                          className="h-px flex-1 max-w-[60px]"
                          style={{ background: `linear-gradient(90deg, ${liquidColors.primary}50, transparent)` }}
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {project.category.slice(0, 2).map((cat) => (
                            <span
                              key={cat}
                              className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full backdrop-blur-md"
                              style={{
                                background: `${liquidColors.primary}15`,
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
                            className="px-3 py-1.5 text-xs rounded-full text-white/70 font-medium backdrop-blur-sm"
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
                            className="inline-flex items-center gap-2 px-6 h-12 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02]"
                            style={{
                              background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                              boxShadow: `0 8px 30px ${liquidColors.primary}35`
                            }}
                          >
                            View Live
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 h-12 rounded-full text-white font-medium text-sm transition-all hover:bg-white/10 backdrop-blur-md"
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: `1px solid ${liquidColors.primary}30`
                            }}
                          >
                            <Github className="w-4 h-4" />
                            Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Counter */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 text-base font-mono px-5 py-2.5 rounded-full backdrop-blur-xl"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: `1px solid ${liquidColors.primary}20`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)`
              }}
            >
              <span
                className="font-bold text-lg"
                style={{ color: liquidColors.primary }}
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-white/20">/</span>
              <span className="text-white/50">{String(projectCount).padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      )}

      <div className="h-16 lg:h-24" />

      {/* Video Modal */}
      {videoModal.isOpen && videoModal.videoUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={closeVideoModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden"
            style={{
              boxShadow: `0 0 0 1px rgba(255,255,255,0.1), 0 40px 100px -20px rgba(0,0,0,0.8)`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={getVideoEmbedUrl(videoModal.videoUrl)}
              className="w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

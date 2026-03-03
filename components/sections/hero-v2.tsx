'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode, PortfolioMode } from '@/components/providers/mode-provider'
import { useRouter } from 'next/navigation'

const modes: {
  id: PortfolioMode
  title: string
  subtitle: string
  micro: string
  color: string
  path: string
}[] = [
  {
    id: 'fullstack',
    title: 'FULL-STACK',
    subtitle: 'Product & Backend Engineering',
    micro: 'Next.js • FastAPI • MongoDB • Cloud',
    color: '#8B5CF6',
    path: '/fullstack'
  },
  {
    id: 'xr',
    title: 'XR & RESEARCH',
    subtitle: 'Spatial Computing • HCI • Immersive Tech',
    micro: 'Unity • ARKit • WebXR • HCI',
    color: '#10B981',
    path: '/xr-research'
  }
]

export default function HeroV2() {
  const { setMode } = useMode()
  const router = useRouter()
  const [showGuidance, setShowGuidance] = useState(false)
  const [moveGuidance, setMoveGuidance] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [hoveredMode, setHoveredMode] = useState<PortfolioMode | null>(null)
  const [xrHighlight, setXrHighlight] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setXrHighlight(false)
    }, 1500)

    // 1. Appear above AASURJYA (after name slide-in completes)
    const guidanceTimer = setTimeout(() => {
      setShowGuidance(true)
    }, 1800)

    // 2. Move to top
    const moveTimer = setTimeout(() => {
      setMoveGuidance(true)
    }, 3200)

    // 3. Finally show content after guidance is in position
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 4000)

    return () => {
      clearTimeout(timer)
      clearTimeout(guidanceTimer)
      clearTimeout(moveTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  const handleModeSelect = (m: typeof modes[0]) => {
    setMode(m.id)
    router.push(m.path)
  }

  return (
    <section
      className="relative h-screen w-full overflow-hidden"
      style={{ background: '#000' }}
      aria-labelledby="hero-heading"
    >
      {/* Vector gradient background — bottommost layer, rendered before everything else */}
      <svg aria-hidden="true" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="heroGrad" cx="50%" cy="40%" r="70%" gradientUnits="objectBoundingBox">
            <stop offset="0%"   stopColor="#12091f" />
            <stop offset="20%"  stopColor="#0d0718" />
            <stop offset="40%"  stopColor="#080510" />
            <stop offset="60%"  stopColor="#040310" />
            <stop offset="80%"  stopColor="#020108" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#heroGrad)" />
      </svg>

      <h1 id="hero-heading" className="sr-only">
        Aasurjya Handique - XR Developer & Spatial Computing Engineer Portfolio
      </h1>
      <p className="sr-only">
        Select a portfolio domain to explore: Full-Stack Development or XR & Research
      </p>

      {/* Background Text Overlay */}
      <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
        <motion.div
          className="text-[15vw] font-black tracking-tighter text-white leading-none whitespace-nowrap"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 0.07 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          AASURJYA
        </motion.div>
        <motion.div
          className="text-[15vw] font-black tracking-tighter text-white leading-none whitespace-nowrap"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 0.07 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
          BIKASH
        </motion.div>
        <motion.div
          className="text-[15vw] font-black tracking-tighter text-white leading-none whitespace-nowrap"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ x: 0, opacity: 0.07 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.4 }}
        >
          HANDIQUE
        </motion.div>
      </div>

      {/* Guidance Line */}
      <AnimatePresence>
        {showGuidance && (
          <motion.p
            className="fixed left-0 right-0 z-20 text-center text-sm md:text-base font-medium text-[#F8F8F8]/70 tracking-wide pointer-events-none"
            initial={{ 
              opacity: 0, 
              top: "25%" 
            }}
            animate={{ 
              opacity: 1, 
              top: moveGuidance ? (typeof window !== 'undefined' && window.innerWidth < 768 ? "32px" : "48px") : "25%"
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              top: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
              opacity: { duration: 0.5 }
            }}
          >
            Explore my work by domain
          </motion.p>
        )}
      </AnimatePresence>

      {/* Main Mode Selection Interface */}
      <div className="relative z-10 grid h-full w-full grid-cols-1 md:grid-cols-2" role="group" aria-label="Portfolio domain selection">
        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-0 backdrop-blur-md bg-black/40"
            />
          )}
          {showContent && modes.map((m, idx) => {
            const isXr = m.id === 'xr'
            const isHighlighted = isXr && xrHighlight

            return (
              <motion.button
                key={m.id}
                onMouseEnter={() => setHoveredMode(m.id)}
                onMouseLeave={() => setHoveredMode(null)}
                onFocus={() => setHoveredMode(m.id)}
                onBlur={() => setHoveredMode(null)}
                onClick={() => handleModeSelect(m)}
                aria-label={`${m.title} — ${m.subtitle}`}
                className="group relative flex cursor-pointer flex-col items-center justify-center border-white/5 transition-all duration-200 ease-out hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-inset focus-visible:brightness-110 md:border-r last:border-r-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                whileHover={{
                  y: -6,
                  boxShadow: '0 10px 24px rgba(0,0,0,0.35)'
                }}
                transition={{
                  duration: 0.8,
                  y: { delay: 0, duration: 0.2 },
                  boxShadow: { delay: 0, duration: 0.2 }
                }}
              >
                {/* Dynamic Hover Background */}
                <AnimatePresence>
                  {(hoveredMode === m.id || isHighlighted) && (
                    <motion.div
                      className="absolute inset-0 z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHighlighted ? 0.2 : 0.15 }}
                      exit={{ opacity: 0 }}
                      style={{ backgroundColor: m.color }}
                    />
                  )}
                </AnimatePresence>

                {/* XR Panel Glow Effect */}
                {isHighlighted && (
                  <motion.div
                    className="absolute inset-0 z-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    style={{
                      boxShadow: `0 0 60px ${m.color}, inset 0 0 30px ${m.color}40`
                    }}
                  />
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center px-4">
                  <motion.span
                    className="text-4xl md:text-5xl font-bold tracking-tighter transition-all duration-200 group-hover:scale-110 group-focus-visible:scale-110"
                    animate={{
                      scale: isHighlighted ? 1.02 : 1,
                      color: hoveredMode === m.id || isHighlighted ? m.color : '#FFFFFF'
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {m.title}
                  </motion.span>
                  <span className="mt-4 text-sm md:text-base font-medium tracking-wide text-white/75 group-hover:text-white group-focus-visible:text-white transition-colors">
                    {m.subtitle}
                  </span>
                  <span className="mt-3 text-xs md:text-sm font-normal tracking-wider text-white/50 group-hover:text-white/70 transition-colors">
                    {m.micro}
                  </span>
                </div>

                {/* Bottom Indicator */}
                <motion.div
                  aria-hidden="true"
                  className="absolute bottom-10 h-1 rounded-full"
                  animate={{
                    backgroundColor: hoveredMode === m.id || isHighlighted ? m.color : 'rgba(255,255,255,0.2)',
                    width: hoveredMode === m.id ? 48 : 24
                  }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Center depth glow — SVG gradient fades naturally to transparent, no hard circular clip */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'blur(72px)' }}>
          <defs>
            <radialGradient id="glowGrad" cx="50%" cy="44%" r="55%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.18" />
              <stop offset="30%"  stopColor="#7c3aed" stopOpacity="0.09" />
              <stop offset="55%"  stopColor="#10b981" stopOpacity="0.04" />
              <stop offset="80%"  stopColor="#8b5cf6" stopOpacity="0.01" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#glowGrad)" />
        </svg>
        {/* Vignette — 5 stops for smooth dark-edge fade, no harsh transition */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="vigGrad" cx="50%" cy="50%" r="80%" gradientUnits="objectBoundingBox">
              <stop offset="0%"   stopColor="#000000" stopOpacity="0" />
              <stop offset="42%"  stopColor="#000000" stopOpacity="0" />
              <stop offset="62%"  stopColor="#000000" stopOpacity="0.18" />
              <stop offset="80%"  stopColor="#000000" stopOpacity="0.42" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#vigGrad)" />
        </svg>
      </div>
    </section>
  )
}

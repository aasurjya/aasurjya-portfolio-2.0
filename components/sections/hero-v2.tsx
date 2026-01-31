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
    title: 'XR DEV',
    subtitle: 'AR / VR & Spatial Computing',
    micro: 'Unity • ARKit • Meta Quest • Omniverse',
    color: '#10B981',
    path: '/xr-dev'
  },
  {
    id: 'phd',
    title: 'RESEARCH',
    subtitle: 'HCI & Academic Direction',
    micro: 'XR • HCI • PhD-aligned work',
    color: '#3B82F6',
    path: '/research'
  }
]

export default function HeroV2() {
  const { setMode } = useMode()
  const router = useRouter()
  const [hoveredMode, setHoveredMode] = useState<PortfolioMode | null>(null)
  const [xrHighlight, setXrHighlight] = useState(true)

  // XR panel auto-highlight on load - glow for 1.5s then settle
  useEffect(() => {
    const timer = setTimeout(() => {
      setXrHighlight(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleModeSelect = (m: typeof modes[0]) => {
    setMode(m.id)
    router.push(m.path)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black" aria-labelledby="hero-heading">
      {/* Screen reader context */}
      <h1 id="hero-heading" className="sr-only">
        Aasurjya Handique - XR Developer & Spatial Computing Engineer Portfolio
      </h1>
      <p className="sr-only">
        Select a portfolio domain to explore: Full-Stack Development, XR Development, or Academic Research
      </p>

      {/* Background Text Overlay - Decorative (reduced opacity) */}
      <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <motion.div
          className="text-[15vw] font-black tracking-tighter text-white opacity-[0.07] leading-none blur-[1px]"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.07 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          AASURJYA
        </motion.div>
        <motion.div
          className="text-[15vw] font-black tracking-tighter text-white opacity-[0.07] leading-none blur-[1px]"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.07 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          HANDIQUE
        </motion.div>
      </div>

      {/* Guidance Line - Above Panels */}
      <motion.p
        className="absolute top-8 md:top-12 left-0 right-0 z-20 text-center text-sm md:text-base font-medium text-[#F8F8F8]/70 tracking-wide pointer-events-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Explore my work by domain
      </motion.p>

      {/* Main Mode Selection Interface */}
      <div className="relative z-10 grid h-full w-full grid-cols-1 md:grid-cols-3" role="group" aria-label="Portfolio domain selection">
        {modes.map((m, idx) => {
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
              whileHover={{
                y: -6,
                boxShadow: '0 10px 24px rgba(0,0,0,0.35)'
              }}
              transition={{
                delay: 0.5 + idx * 0.2,
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
                {/* Title */}
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

                {/* Subtitle */}
                <span className="mt-4 text-sm md:text-base font-medium tracking-wide text-white/75 group-hover:text-white group-focus-visible:text-white transition-colors">
                  {m.subtitle}
                </span>

                {/* Micro descriptors */}
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
      </div>

      {/* Interactive Cursor Light (subtle effect) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
      </div>
    </section>
  )
}

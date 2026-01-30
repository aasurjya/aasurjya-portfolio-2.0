'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode, PortfolioMode } from '@/components/providers/mode-provider'
import gsap from 'gsap'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const modes: { id: PortfolioMode; title: string; subtitle: string; color: string; path: string }[] = [
  { id: 'fullstack', title: 'FULLSTACK', subtitle: 'SaaS & Cloud', color: '#8B5CF6', path: '/fullstack' },
  { id: 'xr', title: 'XR DEV', subtitle: 'Immersive Tech', color: '#10B981', path: '/xr-dev' },
  { id: 'phd', title: 'RESEARCH', subtitle: 'Academic & HCI', color: '#3B82F6', path: '/research' }
]

export default function HeroV2() {
  const { setMode, mode } = useMode()
  const router = useRouter()
  const [hoveredMode, setHoveredMode] = useState<PortfolioMode | null>(null)

  const handleModeSelect = (m: typeof modes[0]) => {
    // We set the mode first to trigger theme changes, then navigate
    setMode(m.id)
    router.push(m.path)
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Text Overlay - Splitting Name */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <motion.div 
          className="text-[15vw] font-black tracking-tighter text-white opacity-10 leading-none"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.1 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          AASURJYA
        </motion.div>
        <motion.div 
          className="text-[15vw] font-black tracking-tighter text-white opacity-10 leading-none"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.1 }}
          transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        >
          HANDIQUE
        </motion.div>
      </div>

      {/* Main Mode Selection Interface */}
      <div className="relative z-10 grid h-full w-full grid-cols-1 md:grid-cols-3">
        {modes.map((m, idx) => (
          <motion.div
            key={m.id}
            onMouseEnter={() => setHoveredMode(m.id)}
            onMouseLeave={() => setHoveredMode(null)}
            onClick={() => handleModeSelect(m)}
            className="group relative flex cursor-pointer flex-col items-center justify-center border-white/5 transition-colors hover:border-white/20 md:border-r last:border-r-0"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.2, duration: 0.8 }}
          >
            {/* Dynamic Hover Background */}
            <AnimatePresence>
              {hoveredMode === m.id && (
                <motion.div
                  className="absolute inset-0 z-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  exit={{ opacity: 0 }}
                  style={{ backgroundColor: m.color }}
                />
              )}
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.span 
                className="mb-2 text-xs font-medium tracking-[0.3em] text-white/40 uppercase"
                animate={{ color: hoveredMode === m.id ? m.color : 'rgba(255,255,255,0.4)' }}
              >
                Explore
              </motion.span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tighter transition-all group-hover:scale-110">
                {m.title}
              </h2>
              <p className="mt-4 text-sm font-light tracking-widest text-white/60 group-hover:text-white transition-colors">
                {m.subtitle}
              </p>
            </div>

            {/* Bottom Indicator */}
            <motion.div 
              className="absolute bottom-10 h-1 w-12 bg-white/20"
              animate={{ 
                backgroundColor: hoveredMode === m.id ? m.color : 'rgba(255,255,255,0.2)',
                width: hoveredMode === m.id ? 48 : 24
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Interactive Cursor Light (optional subtle effect) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
      </div>

      {/* Mode Active Indicator - REMOVED */}
      {/* Only show mode indicator on category-specific pages, not on landing */}
    </section>
  )
}

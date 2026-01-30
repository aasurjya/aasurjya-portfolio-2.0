'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import gsap from 'gsap'
import { Download } from 'lucide-react'

export default function CategoryHero() {
  const { mode } = useMode()
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(
        '.char',
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, delay: 0.5 }
      )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.8'
      )
      .fromTo(
        '.hero-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, stagger: 0.2 },
        '-=1'
      )
    }, containerRef)

    return () => ctx.revert()
  }, [mode])

  const getModeContent = () => {
    switch (mode) {
      case 'phd':
        return {
          title: 'RESEARCHER',
          subtitle: 'Human-Computer Interaction • Brain-Computer Interfaces',
          color: 'from-blue-600/20 via-indigo-500/20 to-blue-400/20',
          accent: 'text-blue-400'
        }
      case 'xr':
        return {
          title: 'XR DEVELOPER',
          subtitle: 'Immersive Tech • Spatial Computing • Creative Code',
          color: 'from-teal-500/20 via-emerald-400/20 to-cyan-500/20',
          accent: 'text-teal-400'
        }
      case 'fullstack':
        return {
          title: 'FULLSTACK',
          subtitle: 'Cloud Architect • SaaS Systems • Scalable Tech',
          color: 'from-purple-600/20 via-violet-400/20 to-fuchsia-500/20',
          accent: 'text-purple-400'
        }
      default:
        return {
          title: 'PORTFOLIO',
          subtitle: 'Design • Develop • Deploy',
          color: 'from-gray-600/20 via-gray-400/20 to-gray-500/20',
          accent: 'text-white'
        }
    }
  }

  const { title, subtitle, color, accent } = getModeContent()

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#050505]"
    >
      {/* Immersive Background Particles/Glow */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${color} to-transparent opacity-30`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/[0.02] blur-[150px] rounded-full animate-pulse" />
      </div>

      <div className="text-center max-w-7xl mx-auto z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4 mb-6"
        >
          <span className={`text-[10px] font-bold tracking-[0.5em] uppercase ${accent} opacity-80`}>
            {mode === 'phd' ? 'Academic Portfolio' : mode === 'xr' ? 'Creative Engineer' : 'System Architect'}
          </span>
        </motion.div>

        <motion.div 
          className="overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <h1 
            ref={titleRef}
            className="text-7xl md:text-[12rem] font-black tracking-tighter leading-[0.8] uppercase text-white"
          >
            {title}
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.5, ease: 'power4.out' }}
          className="hero-line w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" 
        />

        <motion.div 
          ref={subtitleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="text-sm md:text-xl tracking-[0.4em] font-light text-white/40 uppercase max-w-2xl leading-relaxed">
            {subtitle}
          </span>
          <p className="text-base md:text-lg text-white/70 font-light tracking-tight">
            Multi-tenant SaaS • Realtime infrastructure • Immersive product systems
          </p>
          
          <div className="flex gap-4 pt-4">
            <div className={`w-2 h-2 rounded-full ${accent} animate-pulse`} />
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
        </motion.div>
      </div>

      {/* Floating Meta Info */}
      <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 hidden md:block">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Focus</span>
          <span className="text-xs font-medium text-white/60">Multimodal Interaction</span>
        </div>
      </div>

      {/* Resume Button - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 right-8 lg:bottom-12 lg:right-12"
      >
        <a
          href="/resume.pdf"
          download
          className="group relative inline-flex items-center gap-3 px-6 py-3 lg:px-8 lg:py-4 rounded-full text-[9px] lg:text-[10px] tracking-[0.4em] font-black uppercase text-black bg-gradient-to-r from-amber-300 via-orange-400 to-pink-500 shadow-[0_10px_40px_rgba(255,149,0,0.25)] hover:shadow-[0_20px_60px_rgba(255,149,0,0.4)] transition-all duration-500"
        >
          <span className="absolute inset-0 rounded-full border border-white/40 opacity-40 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center gap-2">
            <Download className="w-3 h-3 lg:w-4 lg:h-4" /> Resume
          </span>
        </a>
      </motion.div>

      {/* Scroll Indicator - Bottom Center */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase font-medium">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}

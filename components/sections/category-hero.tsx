'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import gsap from 'gsap'

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
          
          <div className="flex gap-4 pt-4">
            <div className={`w-2 h-2 rounded-full ${accent} animate-pulse`} />
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
          </div>
        </motion.div>
      </div>

      {/* Floating Meta Info */}
      <div className="absolute bottom-12 left-12 hidden lg:block">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Focus</span>
          <span className="text-xs font-medium text-white/60">Multimodal Interaction</span>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden lg:block text-right">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-widest text-white/20 uppercase">Location</span>
          <span className="text-xs font-medium text-white/60">IIT Jodhpur, IN</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="flex flex-col items-center gap-4">
          <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-bold">Explore</span>
          <div className="w-[1px] h-24 bg-gradient-to-b from-white/40 via-white/10 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}

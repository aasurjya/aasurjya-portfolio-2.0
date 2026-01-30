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
          color: 'from-blue-600 via-blue-400 to-indigo-500'
        }
      case 'xr':
        return {
          title: 'XR DEVELOPER',
          subtitle: 'Immersive Tech • Spatial Computing • Creative Code',
          color: 'from-teal-500 via-emerald-400 to-cyan-500'
        }
      case 'fullstack':
        return {
          title: 'FULLSTACK',
          subtitle: 'Cloud Architect • SaaS Systems • Scalable Tech',
          color: 'from-purple-600 via-violet-400 to-fuchsia-500'
        }
      default:
        return {
          title: 'PORTFOLIO',
          subtitle: 'Design • Develop • Deploy',
          color: 'from-gray-600 via-gray-400 to-gray-500'
        }
    }
  }

  const { title, subtitle, color } = getModeContent()

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 pt-20 overflow-hidden"
    >
      {/* Dynamic Background Gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r ${color} opacity-10 blur-[120px] rounded-full`} />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <div className="text-center max-w-5xl mx-auto">
        <motion.div 
          className="flex flex-wrap justify-center overflow-hidden"
          initial="hidden"
          animate="visible"
        >
          <h1 
            ref={titleRef}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase"
          >
            {title}
          </h1>
        </motion.div>

        <div className="hero-line w-full h-px bg-white/20 my-8" />

        <div 
          ref={subtitleRef}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
        >
          <span className="text-sm md:text-lg tracking-[0.3em] font-light text-white/60 uppercase">
            {subtitle}
          </span>
        </div>
        
        <div className="hero-line w-24 h-px bg-white/40 mx-auto mt-12" />
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-widest text-white/40 uppercase">Discover</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </motion.div>
    </section>
  )
}

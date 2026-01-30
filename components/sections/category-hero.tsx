'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import gsap from 'gsap'
import { Download, ChevronDown } from 'lucide-react'

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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-b ${color} to-transparent opacity-30`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-white/[0.02] blur-[100px] rounded-full animate-pulse" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 md:mb-6"
        >
          <span className={`text-[10px] md:text-xs font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase ${accent} opacity-80`}>
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
            className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] font-black tracking-tighter leading-none uppercase text-white"
          >
            {title}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="hero-line w-full max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-6 md:my-10"
        />

        <motion.div
          ref={subtitleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="space-y-4 md:space-y-6"
        >
          <p className="text-xs sm:text-sm md:text-lg tracking-[0.15em] md:tracking-[0.3em] font-light text-white/50 uppercase">
            {subtitle}
          </p>
          <p className="text-sm md:text-base text-white/70 font-light max-w-xl mx-auto">
            Multi-tenant SaaS • Realtime infrastructure • Immersive product systems
          </p>
        </motion.div>
      </div>

      {/* Bottom Center: Resume + Scroll - using inset-x-0 for proper centering */}
      <motion.div
        className="absolute bottom-6 md:bottom-10 inset-x-0 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <a
          href="/resume.pdf"
          download
          className="group relative inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full text-[10px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] font-bold uppercase text-black bg-gradient-to-r from-amber-300 via-orange-400 to-pink-500 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          <span>Resume</span>
        </a>

        <div className="mt-6 md:mt-8 flex flex-col items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white/40 animate-bounce" />
        </div>
      </motion.div>
    </section>
  )
}

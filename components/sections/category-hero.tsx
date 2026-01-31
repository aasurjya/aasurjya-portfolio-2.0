'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import gsap from 'gsap'
import { Download, ChevronDown, Sparkles, FileText } from 'lucide-react'

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
  const [isHovered, setIsHovered] = useState(false)

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

      {/* Bottom Center: Resume + Scroll */}
      <motion.div
        className="absolute bottom-8 md:bottom-12 inset-x-0 flex flex-col items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        {/* Premium Resume Button */}
        <div className="relative">
          {/* Animated glow ring */}
          <motion.div
            className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500 blur-md"
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Outer glow pulse */}
          <motion.div
            className="absolute -inset-3 rounded-full bg-orange-500 blur-xl"
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <motion.a
            href="/resume.pdf"
            download
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-full text-sm md:text-base font-bold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 10px 40px -10px rgba(251, 146, 60, 0.4), 0 0 0 1px rgba(255,255,255,0.2) inset',
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatDelay: 2,
              }}
            />

            {/* Icon with animation */}
            <motion.div
              animate={isHovered ? { y: [0, -3, 0], rotate: [0, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              <FileText className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>

            <span className="relative z-10 tracking-wide">Download Resume</span>

            {/* Download icon appears on hover */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
            </motion.div>
          </motion.a>

          {/* Floating badge */}
          <motion.div
            className="absolute -top-2 -right-2 md:-top-3 md:-right-3 px-2 py-1 rounded-full bg-white text-[9px] md:text-[10px] font-bold text-black shadow-lg flex items-center gap-1"
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>2025</span>
          </motion.div>
        </div>

        {/* Scroll indicator - more subtle */}
        <motion.div
          className="flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
          }}
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-[9px] tracking-[0.3em] text-white/50 uppercase">Explore</span>
          <ChevronDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}

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
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const buttonRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!buttonRef.current || !e.touches[0]) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = (e.touches[0].clientX - rect.left) / rect.width
    const y = (e.touches[0].clientY - rect.top) / rect.height
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) })
  }

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
        {/* Smooth Liquid Button */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }) }}
          onMouseMove={handleMouseMove}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => { setIsHovered(false); setMousePos({ x: 0.5, y: 0.5 }) }}
          onTouchMove={handleTouchMove}
        >
          {/* Outer Glow */}
          <motion.div
            className="absolute -inset-6 md:-inset-10 pointer-events-none rounded-full"
            animate={{
              background: isHovered
                ? `radial-gradient(ellipse 60% 60% at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(99,102,241,0.4) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 75% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)`
                : 'radial-gradient(ellipse 50% 50% at 30% 50%, rgba(99,102,241,0.3) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 75% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
            }}
            style={{ filter: 'blur(20px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />

          {/* Main Button */}
          <motion.a
            ref={buttonRef}
            href="/resume.pdf"
            download
            className="relative inline-flex items-center justify-center gap-3 px-10 py-5 md:px-14 md:py-6 rounded-full text-base md:text-lg font-medium overflow-hidden cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(200,200,220,0.35) 0%, rgba(255,255,255,0.15) 100%)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 20px 40px -15px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.25)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Animated color blobs - smooth spring physics */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {/* Blue blob */}
              <motion.div
                className="absolute w-32 h-32 md:w-40 md:h-40 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(59,130,246,0.85) 0%, rgba(37,99,235,0.6) 50%, transparent 70%)',
                  filter: 'blur(12px)',
                }}
                animate={{
                  x: isHovered ? `${(mousePos.x - 0.5) * -80}%` : ['0%', '40%', '10%', '50%', '0%'],
                  y: isHovered ? `${(mousePos.y - 0.5) * -60}%` : ['0%', '30%', '-20%', '20%', '0%'],
                }}
                transition={isHovered
                  ? { type: 'spring', stiffness: 150, damping: 15 }
                  : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                }
              />

              {/* Purple blob */}
              <motion.div
                className="absolute w-28 h-28 md:w-36 md:h-36 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(109,40,217,0.5) 50%, transparent 70%)',
                  filter: 'blur(10px)',
                  right: '10%',
                  top: '10%',
                }}
                animate={{
                  x: isHovered ? `${(mousePos.x - 0.5) * -70}%` : ['0%', '-30%', '20%', '-40%', '0%'],
                  y: isHovered ? `${(mousePos.y - 0.5) * -50}%` : ['0%', '40%', '-10%', '30%', '0%'],
                }}
                transition={isHovered
                  ? { type: 'spring', stiffness: 120, damping: 12 }
                  : { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                }
              />

              {/* Pink blob */}
              <motion.div
                className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(236,72,153,0.75) 0%, rgba(219,39,119,0.5) 50%, transparent 70%)',
                  filter: 'blur(10px)',
                  left: '30%',
                  bottom: '0%',
                }}
                animate={{
                  x: isHovered ? `${(mousePos.x - 0.5) * -60}%` : ['0%', '30%', '-20%', '40%', '0%'],
                  y: isHovered ? `${(mousePos.y - 0.5) * -70}%` : ['0%', '-30%', '20%', '-20%', '0%'],
                }}
                transition={isHovered
                  ? { type: 'spring', stiffness: 100, damping: 10 }
                  : { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }
                }
              />

              {/* White/light blob */}
              <motion.div
                className="absolute w-36 h-36 md:w-44 md:h-44 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(240,240,255,0.3) 40%, transparent 70%)',
                  filter: 'blur(15px)',
                  right: '0%',
                  top: '20%',
                }}
                animate={{
                  x: isHovered ? `${(mousePos.x - 0.5) * -50}%` : ['0%', '-20%', '30%', '-10%', '0%'],
                  y: isHovered ? `${(mousePos.y - 0.5) * -40}%` : ['0%', '20%', '-30%', '10%', '0%'],
                }}
                transition={isHovered
                  ? { type: 'spring', stiffness: 80, damping: 12 }
                  : { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }
                }
              />

              {/* Cyan blob */}
              <motion.div
                className="absolute w-20 h-20 md:w-28 md:h-28 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(34,211,238,0.7) 0%, rgba(6,182,212,0.4) 50%, transparent 70%)',
                  filter: 'blur(8px)',
                  left: '20%',
                  top: '30%',
                }}
                animate={{
                  x: isHovered ? `${(mousePos.x - 0.5) * -90}%` : ['0%', '50%', '-10%', '40%', '0%'],
                  y: isHovered ? `${(mousePos.y - 0.5) * -80}%` : ['0%', '-20%', '40%', '-30%', '0%'],
                }}
                transition={isHovered
                  ? { type: 'spring', stiffness: 180, damping: 18 }
                  : { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }
                }
              />
            </div>

            {/* Glass surface */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.08) 100%)',
                boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3)',
              }}
            />

            {/* Subtle grain */}
            <div
              className="absolute inset-0 rounded-full opacity-[0.15] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex items-center gap-3">
              <motion.div
                animate={isHovered ? { rotate: [0, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
              </motion.div>
              <span className="tracking-wide text-white font-semibold drop-shadow-lg">
                Download Resume
              </span>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={isHovered ? { opacity: 1, width: 'auto' } : { opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Download className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-lg" />
              </motion.div>
            </div>
          </motion.a>

          {/* Floating badge */}
          <motion.div
            className="absolute -top-2 -right-2 md:-top-3 md:-right-3 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold flex items-center gap-1 z-20"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span className="text-gray-800">2025</span>
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

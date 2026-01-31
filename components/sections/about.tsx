'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { aboutContent } from '@/lib/content-data'
import { Github, Linkedin, Mail, MapPin, Cpu, Globe, ArrowRight, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function About() {
  const { mode } = useMode()
  const sectionRef = useRef<HTMLElement>(null)
  const journeyButtonRef = useRef<HTMLAnchorElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const [isJourneyHovered, setIsJourneyHovered] = useState(false)
  const [journeyMousePos, setJourneyMousePos] = useState({ x: 0.5, y: 0.5 })
  const [isProfileHovered, setIsProfileHovered] = useState(false)
  const [profileMousePos, setProfileMousePos] = useState({ x: 0.5, y: 0.5 })

  const content = mode ? aboutContent[mode] : aboutContent.fullstack

  const handleJourneyMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!journeyButtonRef.current) return
    const rect = journeyButtonRef.current.getBoundingClientRect()
    setJourneyMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  const handleProfileMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!profileRef.current) return
    const rect = profileRef.current.getBoundingClientRect()
    setProfileMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-title-reveal', {
        scrollTrigger: {
          trigger: '.about-title-reveal',
          start: 'top 90%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [mode])

  const getModeColor = () => {
    switch (mode) {
      case 'phd': return 'text-blue-400'
      case 'xr': return 'text-teal-400'
      case 'fullstack': return 'text-purple-400'
      default: return 'text-purple-400'
    }
  }

  const getModeBg = () => {
    switch (mode) {
      case 'phd': return 'bg-blue-500/10'
      case 'xr': return 'bg-teal-500/10'
      case 'fullstack': return 'bg-purple-500/10'
      default: return 'bg-purple-500/10'
    }
  }

  const getModeGradient = () => {
    switch (mode) {
      case 'phd': return { primary: '#3b82f6', secondary: '#6366f1' }
      case 'xr': return { primary: '#14b8a6', secondary: '#06b6d4' }
      case 'fullstack': return { primary: '#8b5cf6', secondary: '#ec4899' }
      default: return { primary: '#8b5cf6', secondary: '#ec4899' }
    }
  }

  const modeGradient = getModeGradient()

  return (
    <section ref={sectionRef} id="about" className="relative py-20 md:py-32 overflow-hidden bg-[#050505]">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[100px] ${getModeBg()} opacity-40`} />
        <div className={`absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full blur-[100px] ${getModeBg()} opacity-40`} />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="about-title-reveal text-center mb-12 md:mb-20">
          <p className={`text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase ${getModeColor()} mb-4`}>
            About Me
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Building the Future
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Bio & Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Awwwards-style Profile Picture */}
            <motion.div
              ref={profileRef}
              className="relative w-fit mx-auto lg:mx-0"
              onMouseEnter={() => setIsProfileHovered(true)}
              onMouseLeave={() => setIsProfileHovered(false)}
              onMouseMove={handleProfileMouseMove}
              style={{
                perspective: '1000px',
              }}
            >
              {/* Outer glow */}
              <motion.div
                className="absolute -inset-8 rounded-full pointer-events-none"
                animate={{
                  background: isProfileHovered
                    ? `radial-gradient(ellipse 80% 80% at ${profileMousePos.x * 100}% ${profileMousePos.y * 100}%, ${modeGradient.primary}40 0%, transparent 70%)`
                    : `radial-gradient(ellipse 60% 60% at 50% 50%, ${modeGradient.primary}25 0%, transparent 70%)`,
                }}
                style={{ filter: 'blur(30px)' }}
                transition={{ duration: 0.4 }}
              />

              {/* Main container with 3D tilt */}
              <motion.div
                className="relative"
                animate={{
                  rotateX: isProfileHovered ? (profileMousePos.y - 0.5) * -20 : 0,
                  rotateY: isProfileHovered ? (profileMousePos.x - 0.5) * 20 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {/* Animated border ring */}
                <div className="absolute -inset-1 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: `conic-gradient(from 0deg, ${modeGradient.primary}, ${modeGradient.secondary}, ${modeGradient.primary})`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                {/* Inner border */}
                <div className="absolute inset-0 rounded-full bg-[#050505]" style={{ margin: '3px' }} />

                {/* Profile image container */}
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white/10">
                  <Image
                    src="https://media.licdn.com/dms/image/v2/D5603AQFyUA6T7hRQsw/profile-displayphoto-crop_800_800/B56ZuU4lSWGwAI-/0/1767729420647?e=1771459200&v=beta&t=7r32CF3VBeklUz34wXsnQtye-XPFYXgujszv58a10JI"
                    alt="Aasurjya Bikash Handique"
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    sizes="(max-width: 768px) 112px, 144px"
                  />

                  {/* Overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isProfileHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Floating orbs */}
                <motion.div
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${modeGradient.primary} 0%, transparent 70%)`,
                    filter: 'blur(2px)',
                  }}
                  animate={{
                    y: isProfileHovered ? [0, -8, 0] : [0, -4, 0],
                    scale: isProfileHovered ? [1, 1.2, 1] : [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${modeGradient.secondary} 0%, transparent 70%)`,
                    filter: 'blur(1px)',
                  }}
                  animate={{
                    y: isProfileHovered ? [0, 6, 0] : [0, 3, 0],
                    x: isProfileHovered ? [0, -4, 0] : [0, -2, 0],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                />
                <motion.div
                  className="absolute top-1/2 -right-4 w-3 h-3 rounded-full"
                  style={{
                    background: `radial-gradient(circle, white 0%, transparent 70%)`,
                    filter: 'blur(1px)',
                  }}
                  animate={{
                    x: isProfileHovered ? [0, 6, 0] : [0, 3, 0],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
              </motion.div>

              {/* Name tag */}
              <motion.div
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full whitespace-nowrap"
                style={{
                  background: 'rgba(0,0,0,0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${modeGradient.primary}40`,
                  boxShadow: `0 4px 20px ${modeGradient.primary}20`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: modeGradient.primary }}>
                  Aasurjya B.H.
                </span>
              </motion.div>
            </motion.div>

            {/* Bio */}
            <div className="space-y-6">
              <p className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed text-white/90">
                {content.bio.split('. ')[0]}.
              </p>
              <p className="text-base md:text-lg text-white/70 leading-relaxed">
                {content.bio.split('. ').slice(1).join('. ')}
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              {content.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <span className={`text-xs font-bold ${getModeColor()} mt-1`}>0{i + 1}</span>
                  <p className="text-sm md:text-base text-white/70 group-hover:text-white/90 transition-colors leading-relaxed">
                    {h}
                  </p>
                </div>
              ))}
            </div>

            {/* Social + Story Link */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6">
              <div className="flex items-center gap-3">
                {[
                  { icon: Github, href: 'https://github.com/aasurjya' },
                  { icon: Linkedin, href: 'https://linkedin.com/in/aasurjya' },
                  { icon: Mail, href: 'mailto:corp.asurjya@gmail.com' }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                ))}
              </div>

              {/* Journey Button - Animated Glass Style */}
              <div className="relative">
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-4 pointer-events-none rounded-full"
                  animate={{
                    background: isJourneyHovered
                      ? `radial-gradient(ellipse 60% 60% at ${journeyMousePos.x * 100}% ${journeyMousePos.y * 100}%, rgba(99,102,241,0.4) 0%, transparent 60%)`
                      : 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)',
                  }}
                  style={{ filter: 'blur(15px)' }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />

                <motion.a
                  ref={journeyButtonRef}
                  href="/story"
                  className="relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium overflow-hidden cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, rgba(200,200,220,0.35) 0%, rgba(255,255,255,0.15) 100%)',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 10px 25px -10px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.25)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onMouseEnter={() => setIsJourneyHovered(true)}
                  onMouseLeave={() => setIsJourneyHovered(false)}
                  onMouseMove={handleJourneyMouseMove}
                >
                  {/* Animated color blobs */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute w-20 h-20 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.85) 0%, rgba(37,99,235,0.6) 50%, transparent 70%)',
                        filter: 'blur(8px)',
                      }}
                      animate={{
                        x: isJourneyHovered ? `${(journeyMousePos.x - 0.5) * -80}%` : ['0%', '40%', '10%', '50%', '0%'],
                        y: isJourneyHovered ? `${(journeyMousePos.y - 0.5) * -60}%` : ['0%', '30%', '-20%', '20%', '0%'],
                      }}
                      transition={isJourneyHovered
                        ? { type: 'spring', stiffness: 150, damping: 15 }
                        : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                      }
                    />
                    <motion.div
                      className="absolute w-16 h-16 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(109,40,217,0.5) 50%, transparent 70%)',
                        filter: 'blur(6px)',
                        right: '10%',
                        top: '10%',
                      }}
                      animate={{
                        x: isJourneyHovered ? `${(journeyMousePos.x - 0.5) * -70}%` : ['0%', '-30%', '20%', '-40%', '0%'],
                        y: isJourneyHovered ? `${(journeyMousePos.y - 0.5) * -50}%` : ['0%', '40%', '-10%', '30%', '0%'],
                      }}
                      transition={isJourneyHovered
                        ? { type: 'spring', stiffness: 120, damping: 12 }
                        : { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
                      }
                    />
                    <motion.div
                      className="absolute w-14 h-14 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(236,72,153,0.75) 0%, rgba(219,39,119,0.5) 50%, transparent 70%)',
                        filter: 'blur(6px)',
                        left: '30%',
                        bottom: '0%',
                      }}
                      animate={{
                        x: isJourneyHovered ? `${(journeyMousePos.x - 0.5) * -60}%` : ['0%', '30%', '-20%', '40%', '0%'],
                        y: isJourneyHovered ? `${(journeyMousePos.y - 0.5) * -70}%` : ['0%', '-30%', '20%', '-20%', '0%'],
                      }}
                      transition={isJourneyHovered
                        ? { type: 'spring', stiffness: 100, damping: 10 }
                        : { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }
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

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-2">
                    <motion.div
                      animate={isJourneyHovered ? { rotate: [0, -5, 5, 0] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <Sparkles className="w-4 h-4 text-white drop-shadow-lg" />
                    </motion.div>
                    <span className="tracking-wide text-white font-semibold drop-shadow-lg">
                      My Journey
                    </span>
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={isJourneyHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-4 h-4 text-white drop-shadow-lg" />
                    </motion.div>
                  </div>
                </motion.a>
              </div>
            </div>
          </motion.div>

          {/* Right: Availability Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-6 md:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-8">
              {/* Status */}
              <div className="flex items-start gap-4">
                <div className="relative mt-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase mb-1">Available</p>
                  <h4 className="text-xl md:text-2xl font-bold text-white">Open for Collaborations</h4>
                </div>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                Open to immersive product mandates that demand architectural thinking, cinematic interfaces, and measurable business impact.
              </p>

              {/* Info Items */}
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: 'Location', value: 'IIT Jodhpur, India' },
                  { icon: Cpu, label: 'Experience', value: '5+ Years in Industry' },
                  { icon: Globe, label: 'Work Style', value: 'Global Remote' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-white/60" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium text-white/90">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Tags */}
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/60 uppercase mb-4">Core Stack</p>
                <div className="flex flex-wrap gap-2">
                  {(mode === 'phd' ? ['Neuro-Adaptive', 'HCI Systems', 'Cognitive Analysis'] :
                    mode === 'xr' ? ['Unity', 'WebGL/Three.js', 'Shader Coding'] :
                    ['SaaS Architecture', 'Cloud Native', 'Web3'])
                    .map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/70">
                        {t}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

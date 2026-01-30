'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { aboutContent, personalStory } from '@/lib/content-data'
import { Download, Github, Linkedin, Mail, MapPin, Wind, ArrowRight, ArrowLeft, Camera, Shield, Cpu, Zap, Globe } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'

const hikingSlidesData = [
  {
    title: 'Annapurna Base Camp',
    location: 'Nepal • 4,130m',
    duration: '8 Days Continuous',
    highlight: 'The ultimate test of endurance.',
    description: 'Eight relentless days of walking through glaciers and rhododendron forests to reach the heart of the Annapurnas.',
    badge: 'Signature Hike',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585018613924-7234b3961080?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=2000&auto=format&fit=crop'
    ]
  },
  {
    title: 'Madhyamaheshwar',
    location: 'Uttarakhand • India',
    duration: '5 Days • Twisted Ankle',
    highlight: 'Resilience over pain.',
    description: 'Conquered the steep ridges of Kedarnath Wildlife Sanctuary on a twisted left ankle. Every step was a battle of will.',
    badge: 'Pure Grit',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596395819057-e37f55a8519a?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2000&auto=format&fit=crop'
    ]
  }
]

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function About() {
  const { mode } = useMode()
  const [view, setView] = useState<'professional' | 'origins'>('professional')
  const sectionRef = useRef<HTMLElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const innerAutoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const content = mode ? aboutContent[mode] : aboutContent.fullstack
  const slides = hikingSlidesData
  const activeSlide = slides[currentSlide]

  const startInnerAutoSlide = useCallback(() => {
    if (innerAutoSlideRef.current) clearInterval(innerAutoSlideRef.current)
    innerAutoSlideRef.current = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % (activeSlide?.images.length || 1))
    }, 3000)
  }, [activeSlide?.images.length])

  const startAutoSlide = useCallback(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current)
    autoSlideRef.current = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % slides.length
        setCurrentImageIndex(0)
        return next
      })
    }, 12000)
  }, [slides.length])

  useEffect(() => {
    if (view === 'origins') {
      startInnerAutoSlide()
    }
    return () => {
      if (innerAutoSlideRef.current) clearInterval(innerAutoSlideRef.current)
    }
  }, [view, activeSlide, startInnerAutoSlide])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-title-reveal', {
        scrollTrigger: {
          trigger: '.about-title-reveal',
          start: 'top 90%',
        },
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
      })

      const buttons = document.querySelectorAll('.magnetic-btn')
      buttons.forEach((btn) => {
        btn.addEventListener('mousemove', (e: any) => {
          const rect = btn.getBoundingClientRect()
          const x = e.clientX - rect.left - rect.width / 2
          const y = e.clientY - rect.top - rect.height / 2
          gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out',
          })
        })
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
          })
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [mode, view])

  useEffect(() => {
    if (view !== 'origins') {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current)
      return
    }
    startAutoSlide()
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current)
    }
  }, [view, startAutoSlide])

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
    setCurrentImageIndex(0)
    startAutoSlide()
  }

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
    setCurrentImageIndex(0)
    startAutoSlide()
  }

  const getModeColor = () => {
    switch (mode) {
      case 'phd': return 'text-blue-400'
      case 'xr': return 'text-teal-400'
      case 'fullstack': return 'text-purple-400'
      default: return 'text-blue-400'
    }
  }

  const getModeBg = () => {
    switch (mode) {
      case 'phd': return 'bg-blue-500/10'
      case 'xr': return 'bg-teal-500/10'
      case 'fullstack': return 'bg-purple-500/10'
      default: return 'bg-blue-500/10'
    }
  }

  const getModeRing = () => {
    switch (mode) {
      case 'phd': return 'ring-blue-500'
      case 'xr': return 'ring-teal-500'
      case 'fullstack': return 'ring-purple-500'
      default: return 'ring-blue-500'
    }
  }

  return (
    <section ref={sectionRef} id="about" className="relative py-32 overflow-hidden bg-[#050505]">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden opacity-30">
        <div className={`absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[150px] ${getModeBg()} animate-pulse`} />
        <div className={`absolute bottom-0 left-0 w-[800px] h-[800px] rounded-full blur-[150px] ${getModeBg()} animate-pulse`} style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 pointer-events-none mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Left Side: Content & Narrative Toggle */}
          <div className="lg:w-7/12 space-y-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setView('professional')}
                  className={`px-8 py-3 rounded-full text-[10px] font-black tracking-[0.3em] transition-all duration-500 ${
                    view === 'professional' 
                    ? `bg-white text-black ring-4 ring-offset-4 ring-offset-[#050505] ${getModeRing()}` 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  PROFESSIONAL
                </button>
                <button 
                  onClick={() => setView('origins')}
                  className={`px-8 py-3 rounded-full text-[10px] font-black tracking-[0.3em] transition-all duration-500 ${
                    view === 'origins' 
                    ? `bg-white text-black ring-4 ring-offset-4 ring-offset-[#050505] ${getModeRing()}` 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  MY ORIGINS
                </button>
              </div>

              <div className="about-title-reveal">
                <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none uppercase text-white/10 absolute -top-10 left-0 select-none">
                  {view === 'origins' ? 'ROOTS' : 'ABOUT'}
                </h2>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-white relative z-10">
                  {view === 'origins' ? 'From Northeast India' : 'About Me'}
                </h2>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {view === 'professional' ? (
                <motion.div
                  key="professional-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-16"
                >
                  <div className="space-y-10">
                    <p className="text-3xl md:text-5xl font-light tracking-tight leading-[1.1] text-white/90 border-l-2 border-white/10 pl-8">
                      {content.bio.split('. ')[0]}.
                    </p>
                    <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light max-w-2xl pl-8">
                      {content.bio.split('. ').slice(1).join('. ')}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 pl-8">
                    {content.highlights.map((h, i) => (
                      <div key={i} className="flex flex-col gap-4 group relative">
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-black tracking-[0.5em] ${getModeColor()}`}>0{i + 1}</span>
                          <div className={`h-[1px] flex-1 bg-white/10 group-hover:bg-primary transition-colors duration-700`} />
                        </div>
                        <span className="text-sm font-bold text-white/40 group-hover:text-white transition-all duration-500 leading-relaxed uppercase tracking-widest">
                          {h}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="origins-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-12"
                >
                  <div className="relative">
                    <span className="text-8xl absolute -top-10 -left-10 opacity-10 font-serif">"</span>
                    <p className="text-2xl md:text-4xl font-light tracking-tight leading-snug text-white/90 italic relative z-10">
                      {personalStory.bio}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-white/10">
                    {personalStory.stats.map((s, i) => (
                      <div key={i} className="space-y-2 group">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-primary transition-colors">{s.label}</p>
                        <p className="text-lg font-bold text-white/80 tracking-tight">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap gap-8 pt-16 border-t border-white/5 pl-8">
              <button 
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = '/resume.pdf'
                  link.download = 'Aasurjya_Handique_Resume.pdf'
                  link.click()
                }}
                className="magnetic-btn group relative px-12 py-6 bg-white text-black rounded-full font-black text-[10px] tracking-[0.3em] overflow-hidden transition-all hover:scale-105"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <Download className="w-4 h-4" />
                  RESUME.PDF
                </div>
                <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-primary/20`} />
              </button>

              <div className="flex items-center gap-6">
                {[
                  { icon: Github, href: 'https://github.com/aasurjya' },
                  { icon: Linkedin, href: 'https://linkedin.com/in/aasurjya' },
                  { icon: Mail, href: 'mailto:hello@aasurjya.com' }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="magnetic-btn w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group"
                  >
                    <social.icon className="w-5 h-5 text-white/40 group-hover:text-current transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Visual Storytelling */}
          <div className="lg:w-5/12 relative min-h-[700px] flex flex-col justify-center w-full sticky top-32">
            <AnimatePresence mode="wait">
              {view === 'origins' ? (
                <motion.div 
                  key="origins-container"
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-10 w-full"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-[1px] ${mode === 'phd' ? 'bg-blue-500' : mode === 'xr' ? 'bg-teal-500' : 'bg-purple-500'}`} />
                      <span className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">Beyond Code</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tight text-white uppercase italic">The Spirit of Adventure</h3>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {personalStory.hobbies.map((hobby, i) => (
                      <div key={i} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 group hover:bg-white/10 transition-all duration-500">
                        <Camera className="w-3 h-3 text-white/40 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-bold tracking-[0.1em] text-white/60 uppercase">{hobby}</span>
                      </div>
                    ))}
                  </div>

                  <div className="relative w-full aspect-[4/4.5] rounded-[40px] overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeSlide?.title}-${currentImageIndex}`}
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                      >
                        {activeSlide && (
                          <Image
                            src={activeSlide.images[currentImageIndex]}
                            alt={activeSlide.title}
                            fill
                            className="object-cover"
                            priority
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
                      </motion.div>
                    </AnimatePresence>

                    <div className="absolute inset-0 flex flex-col justify-between p-10 z-10">
                      <div className="flex justify-between items-start">
                        <span className={`px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-black tracking-[0.3em] text-white uppercase`}>
                          {activeSlide?.badge}
                        </span>
                        <div className="flex gap-3">
                          <button onClick={handlePrevSlide} className="w-12 h-12 rounded-full border border-white/10 bg-black/20 hover:bg-white text-white hover:text-black transition-all duration-500 backdrop-blur-xl flex items-center justify-center group">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                          </button>
                          <button onClick={handleNextSlide} className="w-12 h-12 rounded-full border border-white/10 bg-black/20 hover:bg-white text-white hover:text-black transition-all duration-500 backdrop-blur-xl flex items-center justify-center group">
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-white/90 text-[10px] font-black uppercase tracking-[0.3em]">
                            <span className="flex items-center gap-2 bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/20">
                              <MapPin className="w-3 h-3" /> {activeSlide?.location}
                            </span>
                          </div>
                          <h3 className="text-xs sm:text-sm font-black tracking-[0.4em] text-white uppercase leading-tight drop-shadow-2xl opacity-90">
                            {activeSlide?.title}
                          </h3>
                        </div>
                        <p className="text-sm font-medium text-white/70 leading-relaxed bg-black/40 backdrop-blur-md p-6 rounded-[24px] border border-white/10">
                          {activeSlide?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="professional-visual"
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05, y: -30 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full"
                >
                  <div className="relative p-[1px] rounded-[48px] bg-gradient-to-br from-white/20 via-transparent to-white/5 shadow-2xl">
                    <div className="p-12 rounded-[47px] bg-black/60 backdrop-blur-3xl space-y-14 relative overflow-hidden group border border-white/10">
                      {/* Animated Core */}
                      <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[120px] ${getModeBg()} opacity-50 group-hover:scale-150 transition-transform duration-[2000ms]`} />
                      
                      <div className="space-y-12 relative z-10">
                        <div className="flex justify-between items-start">
                          <div className="space-y-3">
                            <p className="text-[10px] font-black tracking-[0.5em] text-primary uppercase">System Status</p>
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-3 h-3 rounded-full bg-green-500 animate-ping absolute" />
                                <div className="w-3 h-3 rounded-full bg-green-500 relative shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                              </div>
                              <h4 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">ONLINE</h4>
                            </div>
                          </div>
                          <div className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.4em] text-white/60 uppercase backdrop-blur-md">
                            SYNCED
                          </div>
                        </div>

                        <div className="space-y-10">
                          {[
                            { icon: MapPin, label: 'Deployment', value: 'IIT Jodhpur, IN', sub: 'Active Laboratory' },
                            { icon: Cpu, label: 'Core Competency', value: '5+ Yrs Industry', sub: 'Fullstack & Immersive' },
                            { icon: Globe, label: 'Network', value: 'Global Remote', sub: 'Distributed Systems' }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center gap-8 group/item">
                              <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center group-hover/item:bg-white group-hover/item:text-black transition-all duration-700 group-hover/item:rotate-[10deg]">
                                <item.icon className="w-7 h-7" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">{item.label}</p>
                                <p className="text-xl font-bold text-white/90 tracking-tight group-hover/item:text-primary transition-colors">{item.value}</p>
                                <p className="text-[10px] font-medium text-white/30 italic">{item.sub}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-12 border-t border-white/10">
                          <div className="flex items-center justify-between mb-8">
                            <p className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase">Neural Architecture</p>
                            <Zap className={`w-4 h-4 ${getModeColor()} animate-pulse`} />
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {(mode === 'phd' ? ['Neuro-Adaptive', 'HCI Systems', 'Cognitive Analysis'] : 
                              mode === 'xr' ? ['Unity Engine', 'WebGL/Three.js', 'Shader Coding'] : 
                              ['SaaS Architecture', 'Cloud Native', 'Web3 Protocols'])
                              .map(t => (
                                <div key={t} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all duration-500 cursor-pointer group/tag">
                                  <span className="text-[11px] font-bold tracking-wider text-white/50 group-hover/tag:text-white">{t}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}

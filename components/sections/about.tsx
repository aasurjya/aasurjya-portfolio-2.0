'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { aboutContent, personalStory } from '@/lib/content-data'
import { Download, Github, Linkedin, Mail, MapPin, Wind, ArrowRight, ArrowLeft, Camera } from 'lucide-react'
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
      setCurrentImageIndex(prev => (prev + 1) % activeSlide.images.length)
    }, 3000)
  }, [activeSlide.images.length])

  const startAutoSlide = useCallback(() => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current)
    autoSlideRef.current = setInterval(() => {
      setCurrentSlide(prev => {
        const next = (prev + 1) % slides.length
        setCurrentImageIndex(0) // Reset image index on slide change
        return next
      })
    }, 12000) // Longer duration for overall slide to allow inner scrolling
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
      // Title Animation
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

      // Magnetic effect for buttons
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

  return (
    <section ref={sectionRef} id="about" className="relative py-32 overflow-hidden bg-background/50">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] ${getModeBg()} animate-pulse`} />
        <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] ${getModeBg()} animate-pulse`} style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Content & Narrative Toggle */}
          <div className="lg:w-7/12 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => setView('professional')}
                  className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-500 ${
                    view === 'professional' 
                    ? `bg-white text-black ring-2 ring-offset-2 ring-offset-black ${mode === 'phd' ? 'ring-blue-500' : mode === 'xr' ? 'ring-teal-500' : 'ring-purple-500'}` 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  PROFESSIONAL
                </button>
                <button 
                  onClick={() => setView('origins')}
                  className={`px-6 py-2 rounded-full text-sm font-bold tracking-wider transition-all duration-500 ${
                    view === 'origins' 
                    ? `bg-white text-black ring-2 ring-offset-2 ring-offset-black ${mode === 'phd' ? 'ring-blue-500' : mode === 'xr' ? 'ring-teal-500' : 'ring-purple-500'}` 
                    : 'bg-white/5 text-white/40 hover:bg-white/10'
                  }`}
                >
                  MY ORIGINS
                </button>
              </div>

              <div className="about-title-reveal overflow-hidden">
                <h2 className="text-5xl md:text-6xl font-semibold tracking-tight leading-tight mb-4">
                  {view === 'origins' ? 'From Northeast India' : 'About Me'}
                </h2>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5, ease: 'circOut' }}
                className="space-y-8"
              >
                {view === 'professional' ? (
                  <div className="space-y-6">
                    <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light">
                      {content.bio}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      {content.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-3 group">
                          <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-transform group-hover:scale-150 ${getModeColor().replace('text', 'bg')}`} />
                          <span className="text-sm text-white/60 group-hover:text-white transition-colors">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-light">
                      {personalStory.bio}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                      {personalStory.hobbies.map((hobby, i) => (
                        <div key={i} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center text-center">
                          <span className="text-[11px] font-medium text-white/70">{hobby}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-6 pt-8">
              <button 
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = '/resume.pdf'
                  link.download = 'Aasurjya_Sarkar_Resume.pdf'
                  link.click()
                }}
                className="magnetic-btn group relative px-8 py-4 bg-white text-black rounded-full font-bold overflow-hidden transition-all hover:scale-105"
              >
                <div className="relative z-10 flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  RESUME.PDF
                </div>
                <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${getModeBg().replace('/10', '/30')}`} />
              </button>

              <div className="flex items-center gap-4">
                {[
                  { icon: Github, href: 'https://github.com/aasurjya' },
                  { icon: Linkedin, href: 'https://linkedin.com/in/aasurjya' },
                  { icon: Mail, href: 'mailto:aasurjya@example.com' }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="magnetic-btn p-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors group"
                  >
                    <social.icon className="w-5 h-5 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Visual Storytelling */}
          <div className="lg:w-5/12 relative">
            <AnimatePresence mode="wait">
              {view === 'origins' ? (
                <motion.div
                  key="origins-visual"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative w-full aspect-[4/5] rounded-[40px] overflow-hidden group shadow-2xl"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${activeSlide.title}-${currentImageIndex}`}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeSlide.images[currentImageIndex]}
                        alt={activeSlide.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      {/* Sophisticated Gradient Overlay - Darker for readability */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/90" />
                    </motion.div>
                  </AnimatePresence>

                  {/* Narrative Elements */}
                  <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10 z-10">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-bold tracking-[0.2em] text-white uppercase">
                          {activeSlide.badge}
                        </span>
                      </div>
                      
                      {/* Modern Nav */}
                      <div className="flex gap-2">
                        <button
                          onClick={handlePrevSlide}
                          className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all duration-500 backdrop-blur-md flex items-center justify-center group"
                        >
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                          onClick={handleNextSlide}
                          className="w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black transition-all duration-500 backdrop-blur-md flex items-center justify-center group"
                        >
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <motion.div
                        key={`${activeSlide.title}-info`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="space-y-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2.5 text-white/80 text-[10px] uppercase tracking-[0.2em] font-semibold">
                            <span className="px-2 py-0.5 bg-white/10 rounded">{activeSlide.duration}</span>
                            <span className="w-1 h-1 rounded-full bg-white/40" />
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-white" /> {activeSlide.location}</span>
                          </div>
                          <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-white leading-[0.9] drop-shadow-2xl">
                            {activeSlide.title.split(' ').map((word, i) => (
                              <span key={i} className="block">{word}</span>
                            ))}
                          </h3>
                        </div>
                        
                        <p className="text-base text-white/90 leading-relaxed font-medium max-w-sm drop-shadow-lg">
                          {activeSlide.description}
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                          <div className="h-[1px] flex-1 bg-white/30" />
                          <div className="flex gap-1">
                            {slides.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  setCurrentSlide(i)
                                  setCurrentImageIndex(0)
                                }}
                                className={`h-1 rounded-full transition-all duration-500 ${
                                  i === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="professional-visual"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="relative space-y-6"
                >
                  {/* Floating Tech Cards */}
                  <div className={`p-8 rounded-3xl border border-white/10 ${getModeBg()} backdrop-blur-xl relative overflow-hidden group`}>
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-bold tracking-tight">Active Status</h4>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[10px] font-bold text-green-500 uppercase">Available</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-white/60">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">Based in India, Working Globally</span>
                        </div>
                        <div className="flex items-center gap-4 text-white/60">
                          <ArrowRight className="w-4 h-4" />
                          <span className="text-sm">5+ Years Professional Experience</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Current Focus</p>
                        <div className="flex flex-wrap gap-2">
                          {mode === 'phd' && ['HCI', 'Cognitive Load', 'XR Frameworks'].map(t => <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px]">{t}</span>)}
                          {mode === 'xr' && ['Three.js', 'Unity', 'WebXR'].map(t => <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px]">{t}</span>)}
                          {mode === 'fullstack' && ['Next.js', 'SaaS Arch', 'Web3'].map(t => <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px]">{t}</span>)}
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

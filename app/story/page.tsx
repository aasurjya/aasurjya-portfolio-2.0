'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, MapPin, Camera, Mountain, GraduationCap, Briefcase, Rocket, Heart, Quote, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Journey Timeline Data
const journeyChapters = [
  {
    id: 'origins',
    year: '1999',
    title: 'The Beginning',
    subtitle: 'Tiloi Nagar, Assam',
    description: 'Born in a small village in Northeast India where the first WiFi cable only arrived in 2022. Growing up with weak mobile signals and limited connectivity, the digital world felt like a distant dream.',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'education',
    year: '2018',
    title: 'First Steps',
    subtitle: 'Tezpur University',
    description: 'Began B.Tech in Computer Science. First exposure to programming, algorithms, and the vast possibilities of software engineering. Graduated with First Division.',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'industry',
    year: '2022',
    title: 'Into the Industry',
    subtitle: 'Cognizant → IQVIA → Heptre',
    description: 'Started as a Programmer Analyst Trainee, quickly moved to building production systems. Wrote 1000+ unit tests, managed AWS infrastructure, and shipped real products used by thousands.',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'masters',
    year: '2022',
    title: 'Pursuing Excellence',
    subtitle: 'IIT Jodhpur - M.Tech AR/VR',
    description: 'Joined one of India\'s premier institutions to specialize in Augmented and Virtual Reality. Researching neuro-adaptive XR interfaces and building immersive 3D systems.',
    icon: Rocket,
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'current',
    year: '2023',
    title: 'Building the Future',
    subtitle: 'iHub Drishti, IIT Jodhpur',
    description: 'Leading development of scalable Flutter apps, AR/VR systems, and multi-tenant SaaS platforms. Converting point clouds to Gaussian splats. Architecting systems that matter.',
    icon: Rocket,
    color: 'from-amber-500 to-orange-600',
  },
]

const philosophyItems = [
  {
    title: 'Curiosity Over Comfort',
    description: 'From a village with no internet to IIT - the path was never about taking the easy route.',
  },
  {
    title: 'Build to Learn',
    description: 'Every project is an opportunity to push boundaries and discover what\'s possible.',
  },
  {
    title: 'Resilience Through Challenges',
    description: 'Twisted ankle on Madhyamaheshwar, 8 days through Annapurna - obstacles are just waypoints.',
  },
]

const hikingSlidesData = [
  {
    title: 'Annapurna Base Camp',
    location: 'Nepal • 4,130m',
    duration: '8 Days Continuous',
    lesson: 'Endurance is a choice you make every single step.',
    description: 'Eight relentless days of walking through glaciers and rhododendron forests. No shortcuts, no elevators - just one foot in front of the other to reach the heart of the Annapurnas.',
    badge: 'Signature Trek',
    images: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1585018613924-7234b3961080?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?q=80&w=2000&auto=format&fit=crop'
    ]
  },
  {
    title: 'Madhyamaheshwar',
    location: 'Uttarakhand • 3,497m',
    duration: '5 Days • Twisted Ankle',
    lesson: 'Pain is temporary, but quitting lasts forever.',
    description: 'Conquered the steep ridges of Kedarnath Wildlife Sanctuary on a twisted left ankle. Every step was a battle between body and will. The body wanted to stop. The will refused.',
    badge: 'Pure Grit',
    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596395819057-e37f55a8519a?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2000&auto=format&fit=crop'
    ]
  }
]

const statsData = [
  { value: '5+', label: 'Years in Tech' },
  { value: '10+', label: 'Products Shipped' },
  { value: '4,130m', label: 'Highest Altitude' },
  { value: '∞', label: 'Curiosity' },
]

export default function StoryPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLHeadingElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const philosophyRef = useRef<HTMLDivElement>(null)
  const adventureRef = useRef<HTMLDivElement>(null)

  const activeSlide = hikingSlidesData[currentSlide]

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text reveal animation
      if (heroTextRef.current) {
        const words = heroTextRef.current.innerText.split(' ')
        heroTextRef.current.innerHTML = words
          .map(word => `<span class="word inline-block overflow-hidden"><span class="word-inner inline-block">${word}</span></span>`)
          .join(' ')

        gsap.from('.word-inner', {
          y: 100,
          opacity: 0,
          duration: 1,
          stagger: 0.05,
          ease: 'power4.out',
          delay: 0.5,
        })
      }

      // Timeline section animations
      gsap.from('.timeline-title', {
        scrollTrigger: {
          trigger: '.timeline-title',
          start: 'top 85%',
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })

      // Philosophy section animations
      gsap.from('.philosophy-title', {
        scrollTrigger: {
          trigger: '.philosophy-title',
          start: 'top 85%',
        },
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })

      // Adventure section animations
      gsap.from('.adventure-title', {
        scrollTrigger: {
          trigger: '.adventure-title',
          start: 'top 85%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })

      // Stats counter animation
      gsap.from('.stat-value', {
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        },
        textContent: 0,
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        stagger: 0.2,
      })

    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={heroRef} className="min-h-screen bg-[#050505] text-white">
      {/* Hero - The Hook */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] bg-purple-500/20" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] bg-blue-500/20" />
        </div>

        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-20">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <Link href="/fullstack" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
          </motion.div>

          {/* Main Quote */}
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Quote className="w-12 h-12 text-purple-400/50 mx-auto" />
            </motion.div>

            <h1
              ref={heroTextRef}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed text-white/90 max-w-4xl mx-auto"
            >
              From a village where WiFi arrived in 2022 to building systems at one of India&apos;s premier tech institutes.
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="text-lg md:text-xl text-white/50"
            >
              This is the story of curiosity, resilience, and relentless growth.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.8 }}
              className="pt-8"
            >
              <p className="text-sm text-purple-400 font-medium tracking-wider uppercase">
                Aasurjya Bikash Handique
              </p>
              <p className="text-sm text-white/30 mt-1">
                Tiloi Nagar, Assam → IIT Jodhpur
              </p>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 inset-x-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            <div className="flex flex-col items-center gap-2 text-white/30">
              <span className="text-[10px] tracking-widest uppercase">Scroll to explore</span>
              <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="stats-section py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="stat-value text-3xl md:text-4xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section ref={timelineRef} className="py-20 md:py-32">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="timeline-title text-center mb-16">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-purple-400 mb-4">
              The Journey
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Chapter by Chapter
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-emerald-500/50 md:-translate-x-1/2" />

            {journeyChapters.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-start gap-6 md:gap-12 mb-12 md:mb-16 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-3 h-3 rounded-full bg-white border-4 border-[#050505] z-10" />

                {/* Content */}
                <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  <div className={`inline-flex items-center gap-2 mb-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${chapter.color} flex items-center justify-center`}>
                      <chapter.icon className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-xs font-bold text-white/40 tracking-wider">{chapter.year}</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{chapter.title}</h3>
                  <p className="text-sm text-purple-400 mb-3">{chapter.subtitle}</p>
                  <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-md">
                    {chapter.description}
                  </p>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section ref={philosophyRef} className="py-20 md:py-32 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="philosophy-title text-center mb-16">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-purple-400 mb-4">
              What Drives Me
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Philosophy
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {philosophyItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <span className="text-lg font-black text-purple-400">{index + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Adventures Section */}
      <section ref={adventureRef} className="py-20 md:py-32">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="adventure-title mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Mountain className="w-5 h-5 text-purple-400" />
              <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white/40">
                Beyond the Screen
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Mountain Lessons
            </h2>
            <p className="text-base md:text-lg text-white/50 max-w-2xl">
              The mountains don&apos;t care about your code. They teach you something more fundamental—patience, resilience, and the art of putting one foot in front of the other when everything hurts.
            </p>
          </div>

          {/* Adventure Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl md:rounded-3xl overflow-hidden border border-white/10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeSlide.title}-${currentImageIndex}`}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <Image
                  src={activeSlide.images[currentImageIndex]}
                  alt={activeSlide.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 z-10">
              {/* Top */}
              <div className="flex justify-between items-start">
                <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur border border-white/20 text-[10px] font-bold tracking-wider text-white uppercase">
                  {activeSlide.badge}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentSlide(prev => (prev - 1 + hikingSlidesData.length) % hikingSlidesData.length)
                      setCurrentImageIndex(0)
                    }}
                    className="w-10 h-10 rounded-full border border-white/20 bg-black/30 hover:bg-white hover:text-black text-white transition-all flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSlide(prev => (prev + 1) % hikingSlidesData.length)
                      setCurrentImageIndex(0)
                    }}
                    className="w-10 h-10 rounded-full border border-white/20 bg-black/30 hover:bg-white hover:text-black text-white transition-all flex items-center justify-center"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-[10px] font-bold text-white uppercase tracking-wider">
                      <MapPin className="w-3 h-3" /> {activeSlide.location}
                    </span>
                    <span className="text-xs text-white/50">{activeSlide.duration}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                    {activeSlide.title}
                  </h3>
                </div>

                <div className="bg-black/50 backdrop-blur p-4 rounded-xl border border-white/10 max-w-xl space-y-2">
                  <p className="text-sm md:text-base text-white/80">{activeSlide.description}</p>
                  <p className="text-xs md:text-sm text-purple-400 italic font-medium">
                    &ldquo;{activeSlide.lesson}&rdquo;
                  </p>
                </div>

                {/* Image Dots */}
                <div className="flex gap-2">
                  {activeSlide.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-6' : 'bg-white/30 w-1.5'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Slide Selector */}
          <div className="flex justify-center gap-3 mt-6">
            {hikingSlidesData.map((slide, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index)
                  setCurrentImageIndex(0)
                }}
                className={`px-5 py-2.5 rounded-full border text-xs font-bold transition-all ${
                  index === currentSlide
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white/50 border-white/20 hover:border-white/40'
                }`}
              >
                {slide.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hobbies */}
      <section className="py-16 border-t border-white/5">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {['High-altitude Hiking', 'Landscape Photography', 'Solo Traveling', 'Exploring Cultures'].map((hobby, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-5 py-3 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-2 hover:border-purple-500/30 transition-colors"
              >
                <Camera className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white/70">{hobby}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 border-t border-white/5">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              The Journey Continues
            </h2>
            <p className="text-base md:text-lg text-white/50 max-w-lg mx-auto">
              From Tiloi Nagar to wherever the next challenge takes me. If you&apos;re building something ambitious, let&apos;s talk.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/fullstack#contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-sm hover:bg-white/90 transition-colors"
              >
                Let&apos;s Connect
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/fullstack"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-bold text-sm hover:bg-white/10 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

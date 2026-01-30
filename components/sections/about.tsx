'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { aboutContent } from '@/lib/content-data'
import { Github, Linkedin, Mail, MapPin, Cpu, Globe, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function About() {
  const { mode } = useMode()
  const sectionRef = useRef<HTMLElement>(null)

  const content = mode ? aboutContent[mode] : aboutContent.fullstack

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
            {/* Bio */}
            <div className="space-y-6">
              <p className="text-xl sm:text-2xl md:text-3xl font-light leading-relaxed text-white/90">
                {content.bio.split('. ')[0]}.
              </p>
              <p className="text-base md:text-lg text-white/50 leading-relaxed">
                {content.bio.split('. ').slice(1).join('. ')}
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              {content.highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <span className={`text-xs font-bold ${getModeColor()} mt-1`}>0{i + 1}</span>
                  <p className="text-sm md:text-base text-white/60 group-hover:text-white/90 transition-colors leading-relaxed">
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

              <Link
                href="/story"
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
              >
                <span className="text-sm">Learn about my journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
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

              <p className="text-sm text-white/50 leading-relaxed">
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
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-medium text-white/90">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tech Tags */}
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-4">Core Stack</p>
                <div className="flex flex-wrap gap-2">
                  {(mode === 'phd' ? ['Neuro-Adaptive', 'HCI Systems', 'Cognitive Analysis'] :
                    mode === 'xr' ? ['Unity', 'WebGL/Three.js', 'Shader Coding'] :
                    ['SaaS Architecture', 'Cloud Native', 'Web3'])
                    .map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/60">
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

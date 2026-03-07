'use client'

import { useEffect, useRef, memo } from 'react'
import { motion } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { aboutContent } from '@/lib/content-data'
import { Github, Linkedin, Mail, MapPin, Cpu, Globe, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'
import Image from 'next/image'
import { getModeColor, getModeBgOpacity, getModeGradient } from '@/lib/theme-colors'

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

  const modeColor = getModeColor(mode)
  const modeGradient = getModeGradient(mode)

  return (
    <section ref={sectionRef} id="about" className="relative py-20 md:py-32 overflow-hidden bg-[#050505]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="about-title-reveal text-center mb-12 md:mb-20">
          <p className={`text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase ${modeColor} mb-4`}>
            About Me
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Building the Future
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Bio & Highlights */}
          <div className="space-y-8">
            {/* Profile Picture */}
            <div className="relative w-fit mx-auto lg:mx-0">
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-white/20">
                <Image
                  src="/profile-image.jpg"
                  alt="Aasurjya Bikash Handique"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 144px"
                />
              </div>

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
            </div>

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
                  <span className={`text-xs font-bold ${modeColor} mt-1`}>0{i + 1}</span>
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
                  { icon: Github, href: 'https://github.com/aasurjya', label: 'GitHub' },
                  { icon: Linkedin, href: 'https://linkedin.com/in/aasurjya', label: 'LinkedIn' },
                  { icon: Mail, href: 'mailto:corp.asurjya@gmail.com', label: 'Email' }
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track-event="social_link_click"
                    data-track-target={social.label}
                    data-track-meta-url={social.href}
                    data-track-meta-section="about"
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300"
                  >
                    <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </a>
                ))}
              </div>

              {/* Journey Button - Glass Pill */}
              <motion.a
                href="/story"
                data-track-event="journey_button_click"
                data-track-target="my_journey"
                className="relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium overflow-hidden cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,200,220,0.25) 0%, rgba(255,255,255,0.10) 100%)',
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.15), 0 10px 25px -10px rgba(0,0,0,0.35)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className="tracking-wide text-white font-semibold">My Journey</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </motion.a>
            </div>
          </div>

          {/* Right: Availability Card */}
          <div>
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
                  {(mode === 'xr' ? ['Unity', 'WebGL/Three.js', 'Shader Coding', 'HCI'] :
                    ['SaaS Architecture', 'Cloud Native', 'Web3'])
                    .map(t => (
                      <span key={t} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-white/70">
                        {t}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

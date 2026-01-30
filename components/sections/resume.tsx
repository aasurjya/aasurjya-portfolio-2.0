'use client'

import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { resumeContent } from '@/lib/content-data'
import { GraduationCap, Briefcase, Calendar, MapPin, ChevronRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Resume() {
  const { mode } = useMode()
  const sectionRef = useRef<HTMLElement>(null)
  const content = resumeContent[mode || 'fullstack']

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.resume-item', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
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
      default: return 'text-blue-400'
    }
  }

  const getModeBorder = () => {
    switch (mode) {
      case 'phd': return 'border-blue-500/30'
      case 'xr': return 'border-teal-500/30'
      case 'fullstack': return 'border-purple-500/30'
      default: return 'border-blue-500/30'
    }
  }

  return (
    <section ref={sectionRef} id="resume" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Journey</h2>
          <div className={`h-1 w-20 mx-auto rounded-full ${getModeColor().replace('text', 'bg')}`} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative">
          {/* Vertical Divider for Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />

          {/* Education Column */}
          <div className="space-y-12">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-xl bg-white/5 border ${getModeBorder()}`}>
                <GraduationCap className={`w-6 h-6 ${getModeColor()}`} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Education</h3>
            </div>

            {content.education.map((item, idx) => (
              <div key={item.id} className="resume-item relative pl-8 lg:pr-8 lg:pl-0 lg:text-right group">
                {/* Connector Dot */}
                <div className={`absolute top-2 -left-[5px] lg:left-auto lg:-right-[5px] w-2.5 h-2.5 rounded-full bg-white/20 group-hover:${getModeColor().replace('text', 'bg')} transition-colors duration-300 z-10`} />
                
                <div className={`p-6 rounded-2xl bg-white/5 border ${getModeBorder()} hover:bg-white/10 transition-all duration-300 backdrop-blur-sm`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-medium mb-3 ${getModeColor()}`}>
                    <Calendar className="w-3 h-3" />
                    {item.duration}
                  </div>
                  <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                  <div className="text-white/60 font-medium mb-2">{item.organization}</div>
                  <div className="flex items-center gap-2 text-white/40 text-sm mb-4 lg:justify-end">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </div>
                  <ul className="space-y-2 text-sm text-white/70">
                    {item.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 lg:flex-row-reverse">
                        <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${getModeColor()}`} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Experience Column */}
          <div className="space-y-12">
            <div className="flex items-center gap-4 mb-8">
              <div className={`p-3 rounded-xl bg-white/5 border ${getModeBorder()}`}>
                <Briefcase className={`w-6 h-6 ${getModeColor()}`} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Experience</h3>
            </div>

            {content.experience.map((item, idx) => (
              <div key={item.id} className="resume-item relative pl-8 group">
                {/* Connector Dot */}
                <div className={`absolute top-2 -left-[5px] w-2.5 h-2.5 rounded-full bg-white/20 group-hover:${getModeColor().replace('text', 'bg')} transition-colors duration-300 z-10`} />
                
                <div className={`p-6 rounded-2xl bg-white/5 border ${getModeBorder()} hover:bg-white/10 transition-all duration-300 backdrop-blur-sm`}>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs font-medium mb-3 ${getModeColor()}`}>
                    <Calendar className="w-3 h-3" />
                    {item.duration}
                  </div>
                  <h4 className="text-xl font-bold mb-1">{item.title}</h4>
                  <div className="text-white/60 font-medium mb-2">{item.organization}</div>
                  <div className="flex items-center gap-2 text-white/40 text-sm mb-4">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </div>
                  <ul className="space-y-2 text-sm text-white/70">
                    {item.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 ${getModeColor()}`} />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

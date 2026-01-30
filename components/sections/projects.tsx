'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { projects } from '@/lib/content-data'
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Projects() {
  const { mode } = useMode()
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeProject, setActiveProject] = useState<string | null>(null)

  // Filter projects based on mode
  const filteredProjects = mode 
    ? projects.filter(p => p.modes.includes(mode))
    : projects

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title Animation
      gsap.from('.section-title-char', {
        scrollTrigger: {
          trigger: '.projects-title',
          start: 'top 80%',
        },
        y: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'power4.out'
      })

      // Project Cards Animation
      const cards = gsap.utils.toArray('.project-card') as HTMLElement[]
      cards.forEach((card, i) => {
        const image = card.querySelector('.project-image')
        const content = card.querySelector('.project-content')

        // Parallax Effect
        gsap.fromTo(image, 
          { scale: 1.05 },
          { 
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1
            },
            scale: 1,
            ease: 'none'
          }
        )

        // Content Reveal
        gsap.from(content, {
          scrollTrigger: {
            trigger: card,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          },
          y: 50,
          opacity: 0,
          duration: 0.8,
          delay: 0.2
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [filteredProjects])

  const getThemeColor = () => {
    switch (mode) {
      case 'phd': return 'text-blue-400 group-hover:text-blue-300'
      case 'xr': return 'text-teal-400 group-hover:text-teal-300'
      case 'fullstack': return 'text-purple-400 group-hover:text-purple-300'
      default: return 'text-white'
    }
  }

  const getBorderColor = () => {
    switch (mode) {
      case 'phd': return 'hover:border-blue-500/50'
      case 'xr': return 'hover:border-teal-500/50'
      case 'fullstack': return 'hover:border-purple-500/50'
      default: return 'hover:border-white/50'
    }
  }

  return (
    <section ref={containerRef} id="projects" className="py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r ${
          mode === 'phd' ? 'from-blue-600/10 to-indigo-600/10' :
          mode === 'xr' ? 'from-teal-500/10 to-cyan-500/10' :
          'from-purple-600/10 to-pink-600/10'
        } rounded-full blur-3xl animate-pulse`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r ${
          mode === 'phd' ? 'from-indigo-600/10 to-blue-600/10' :
          mode === 'xr' ? 'from-cyan-500/10 to-teal-500/10' :
          'from-pink-600/10 to-purple-600/10'
        } rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Section Header */}
        <div className="projects-title mb-24 relative z-10">
          <h2 className="text-[12vw] md:text-[8vw] font-black leading-none tracking-tighter opacity-10 absolute -top-1/2 left-0 w-full select-none pointer-events-none">
            WORK
          </h2>
          <div className="flex flex-col gap-4 relative">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight overflow-hidden">
              <span className="inline-block">Selected</span>{' '}
              <span className={`inline-block italic ${getThemeColor().split(' ')[0]}`}>Works</span>
            </h2>
            <div className="w-24 h-1 bg-white/20" />
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-32">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id}
              className={`project-card group relative grid md:grid-cols-12 gap-8 items-center ${
                index % 2 === 0 ? 'text-left' : 'md:text-right'
              }`}
              onMouseEnter={() => setActiveProject(project.id)}
              onMouseLeave={() => setActiveProject(null)}
            >
              {/* Project Image Area */}
              <div className={`md:col-span-8 relative aspect-[4/3] md:aspect-[3/2] rounded-xl overflow-hidden border border-white/10 transition-colors duration-500 ${getBorderColor()} ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                <div className="project-image absolute inset-0 w-full h-full bg-black">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-contain transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement!.style.backgroundColor = '#1a1a1a'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <span className="text-white/40 text-lg">Coming Soon</span>
                    </div>
                  )}
                </div>
                
                {/* Floating Tags for Mobile */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 md:hidden">
                  {project.technologies.slice(0, 3).map(tech => (
                    <span key={tech} className="px-2 py-1 text-[10px] bg-black/60 backdrop-blur-md border border-white/10 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Details */}
              <div className={`project-content md:col-span-4 relative z-10 flex flex-col justify-center h-full ${index % 2 === 0 ? 'md:order-2 md:pl-8' : 'md:order-1 md:pr-8'}`}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className={`text-xs font-mono tracking-widest uppercase opacity-60 ${getThemeColor().split(' ')[0]}`}>
                      {project.category.join(' • ')}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold leading-tight group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-white/60 text-sm md:text-base leading-relaxed line-clamp-4 group-hover:text-white/80 transition-colors">
                    {project.longDescription || project.description}
                  </p>

                  <div className={`hidden md:flex flex-wrap gap-2 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1 text-xs border border-white/10 rounded-full hover:bg-white/5 transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className={`flex gap-6 pt-4 ${index % 2 === 0 ? 'justify-start' : 'md:justify-end'}`}>
                    {project.link && (
                      <a 
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-sm font-medium border-b border-transparent hover:border-current transition-all pb-0.5 ${getThemeColor().split(' ')[0]}`}
                      >
                        Visit Site <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                    {project.github && (
                      <a 
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

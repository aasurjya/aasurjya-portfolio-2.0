'use client'

import Image from 'next/image'
import { Github, ArrowUpRight, Play } from 'lucide-react'
import type { LiquidColors, Project } from './types'

interface ProjectCardProps {
  project: Project
  index: number
  liquidColors: LiquidColors
  cardBg: string
  isDesktop?: boolean
  onVideoClick?: (videoUrl: string, buttonElement: HTMLButtonElement) => void
  showVideo?: boolean
}

export default function ProjectCard({
  project,
  index,
  liquidColors,
  cardBg,
  isDesktop = false,
  onVideoClick,
  showVideo = true
}: ProjectCardProps) {
  const maxTech = isDesktop ? 4 : 3
  const maxCategories = 2

  return (
    <div
      className={`relative w-full h-full ${isDesktop ? 'rounded-3xl' : 'rounded-2xl'} overflow-hidden`}
      style={{
        backgroundColor: cardBg,
        boxShadow: isDesktop
          ? `0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px -20px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)`
          : `0 0 0 1px rgba(255,255,255,0.06), 0 20px 50px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255,255,255,0.05)`
      }}
      role="tabpanel"
      id={`project-${project.id}`}
      aria-label={project.title}
    >
      {/* Image Background */}
      <div className="absolute inset-0">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-center"
            sizes={isDesktop ? '(max-width: 1400px) 100vw, 1400px' : '(max-width: 600px) 100vw, 600px'}
            priority={index === 0}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              background: `
                radial-gradient(ellipse 100% 100% at 70% 30%, ${liquidColors.primary}15 0%, transparent 50%),
                radial-gradient(ellipse 80% 80% at 30% 70%, ${liquidColors.secondary}10 0%, transparent 50%),
                linear-gradient(135deg, ${cardBg} 0%, ${liquidColors.primary}08 100%)
              `
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: isDesktop
              ? `linear-gradient(to right, ${cardBg} 0%, ${cardBg}f5 25%, ${cardBg}cc 40%, ${cardBg}66 55%, transparent 75%)`
              : `linear-gradient(to top, ${cardBg} 0%, ${cardBg}f5 25%, ${cardBg}aa 45%, transparent 70%)`
          }}
        />
      </div>

      {/* Large decorative number (desktop only) */}
      {isDesktop && (
        <div className="absolute top-6 right-8 z-10 pointer-events-none">
          <span
            className="text-[140px] lg:text-[180px] font-black leading-none"
            style={{
              background: `linear-gradient(135deg, ${liquidColors.primary}08, ${liquidColors.secondary}05)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              opacity: 0.6
            }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Video Play Button */}
      {showVideo && project.video && onVideoClick && (
        <button
          onClick={(e) => onVideoClick(project.video!, e.currentTarget)}
          className={`absolute ${isDesktop ? 'top-1/2 right-[20%] -translate-y-1/2' : 'top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2'} rounded-full flex items-center justify-center transition-all hover:scale-110 z-20 group video-play-btn`}
          style={{
            width: isDesktop ? '80px' : '64px',
            height: isDesktop ? '80px' : '64px',
            background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
            boxShadow: `0 8px ${isDesktop ? 40 : 32}px ${liquidColors.primary}50`
          }}
          aria-label={`Play video for ${project.title}`}
        >
          <Play
            className={`${isDesktop ? 'w-8 h-8' : 'w-7 h-7'} text-white ml-1 group-hover:scale-110 transition-transform`}
            fill="white"
          />
        </button>
      )}

      {/* Content */}
      <div className={`${isDesktop ? 'relative h-full flex flex-col justify-center p-8 lg:p-12 max-w-[55%]' : 'absolute bottom-0 left-0 right-0 p-5'}`}>
        {/* Category row */}
        <div className={`flex items-center gap-${isDesktop ? '3' : '2'} mb-${isDesktop ? '4' : '3'}`}>
          <span
            className={`${isDesktop ? 'text-4xl' : 'text-2xl'} font-black`}
            style={{
              background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          {isDesktop && (
            <div
              className="h-px flex-1 max-w-[60px]"
              style={{ background: `linear-gradient(90deg, ${liquidColors.primary}50, transparent)` }}
              aria-hidden="true"
            />
          )}
          <div className="flex flex-wrap gap-1.5">
            {project.category.slice(0, maxCategories).map((cat) => (
              <span
                key={cat}
                className={`px-2${isDesktop ? '.5' : ''} py-${isDesktop ? '1' : '0.5'} text-[${isDesktop ? '10' : '9'}px] font-bold tracking-wider uppercase rounded-full ${isDesktop ? 'backdrop-blur-md' : ''}`}
                style={{
                  background: `${liquidColors.primary}${isDesktop ? '15' : '20'}`,
                  border: `1px solid ${liquidColors.primary}${isDesktop ? '30' : '40'}`,
                  color: liquidColors.primary
                }}
              >
                {cat}
              </span>
            ))}
          </div>
          {isDesktop && project.featured && (
            <span
              className="px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase rounded-full text-white"
              style={{
                background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                boxShadow: `0 4px 15px ${liquidColors.primary}40`
              }}
              aria-label="Featured project"
            >
              ★
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`${isDesktop ? 'text-4xl lg:text-5xl xl:text-6xl mb-3 leading-[1.05]' : 'text-xl sm:text-2xl mb-2'} font-bold tracking-tight text-white`}>
          {project.title}
        </h3>

        {/* Description */}
        <p className={`text-white/${isDesktop ? '70' : '60'} ${isDesktop ? 'text-base lg:text-lg leading-relaxed mb-5 line-clamp-3 max-w-xl' : 'text-sm leading-relaxed mb-4 line-clamp-2'}`}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className={`flex flex-wrap items-center gap-${isDesktop ? '2' : '1.5'} mb-${isDesktop ? '6' : '4'}`}>
          {project.technologies.slice(0, maxTech).map((tech) => (
            <span
              key={tech}
              className={`px-${isDesktop ? '3' : '2.5'} py-1${isDesktop ? '.5' : ''} text-${isDesktop ? 'xs' : '[10px]'} rounded-full text-white/${isDesktop ? '70' : '60'} font-medium ${isDesktop ? 'backdrop-blur-sm' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > maxTech && (
            <span className={`text-${isDesktop ? 'sm' : 'xs'} text-white/40`}>
              +{project.technologies.length - maxTech}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className={`flex ${isDesktop ? 'flex-wrap' : ''} items-center gap-${isDesktop ? '3' : '2'}`}>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDesktop ? 'inline-flex px-6' : 'flex-1 flex justify-center'} items-center gap-2 h-${isDesktop ? '12' : '11'} rounded-${isDesktop ? 'full' : 'xl'} text-white font-semibold text-sm transition-all hover:scale-[1.02]`}
              style={{
                background: `linear-gradient(135deg, ${liquidColors.primary}, ${liquidColors.secondary})`,
                boxShadow: isDesktop ? `0 8px 30px ${liquidColors.primary}35` : undefined
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${project.title} live`}
            >
              View Live
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`${isDesktop ? 'inline-flex px-6' : 'h-11 w-11 flex'} items-center ${isDesktop ? 'gap-2' : ''} justify-center h-${isDesktop ? '12' : '11'} rounded-${isDesktop ? 'full' : 'xl'} text-white font-medium text-sm transition-all hover:bg-white/10 ${isDesktop ? 'backdrop-blur-md' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${liquidColors.primary}30`
              }}
              onClick={(e) => e.stopPropagation()}
              aria-label={`View ${project.title} source code on GitHub`}
            >
              <Github className={`w-${isDesktop ? '4' : '5'} h-${isDesktop ? '4' : '5'}`} aria-hidden="true" />
              {isDesktop && 'Source'}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

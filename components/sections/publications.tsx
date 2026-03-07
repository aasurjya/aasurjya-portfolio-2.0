'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { publications } from '@/lib/content-data'
import { FileText, ExternalLink, Calendar, Users } from 'lucide-react'

export default function Publications() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  if (publications.length === 0) return null

  const typeColors: Record<string, string> = {
    journal: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    conference: 'bg-green-500/10 text-green-400 border-green-500/20',
    thesis: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    workshop: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
  }

  return (
    <section id="publications" ref={sectionRef} className="py-20 md:py-32 bg-[#050505] px-4">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white/40 mb-4">
              Research
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
              Published Research
            </h2>
          </div>

          <div className="space-y-4">
            {publications.map((pub) => (
              <div
                key={pub.id}
                className="bg-white/[0.03] p-6 rounded-2xl border border-white/10 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-white/40" />
                      <span className={`px-2.5 py-1 text-xs rounded-full border ${typeColors[pub.type] ?? 'bg-white/5 text-white/60 border-white/10'}`}>
                        {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {pub.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                      <Users className="w-4 h-4" />
                      <span>{pub.authors.join(', ')}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="font-medium">{pub.venue}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{pub.year}</span>
                      </div>
                    </div>

                    {pub.abstract && (
                      <p className="mt-3 text-sm text-white/50 line-clamp-2">
                        {pub.abstract}
                      </p>
                    )}
                  </div>

                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-white/5 text-white/70 border border-white/10 rounded-xl hover:bg-white/10 transition-colors shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
            >
              View all publications on Google Scholar
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

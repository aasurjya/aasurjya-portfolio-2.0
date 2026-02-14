'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { publications } from '@/lib/content-data'
import { FileText, ExternalLink, Calendar, Users } from 'lucide-react'

export default function Publications() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const typeColors = {
    journal: 'bg-blue-500/10 text-blue-500',
    conference: 'bg-green-500/10 text-green-500',
    thesis: 'bg-purple-500/10 text-purple-500',
    workshop: 'bg-orange-500/10 text-orange-500'
  }

  return (
    <section id="publications" ref={sectionRef} className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-center">Published Research</h2>

          <div className="space-y-6">
            {publications.map((pub, index) => (
              <motion.div
                key={pub.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card p-6 rounded-lg border hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <span className={`px-2 py-1 text-xs rounded ${typeColors[pub.type]}`}>
                        {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                      {pub.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Users className="w-4 h-4" />
                      <span>{pub.authors.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium">{pub.venue}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{pub.year}</span>
                      </div>
                    </div>
                    
                    {pub.abstract && (
                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                        {pub.abstract}
                      </p>
                    )}
                  </div>
                  
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <a
              href="https://scholar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              View all publications on Google Scholar
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

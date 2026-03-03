'use client'

import { motion } from 'framer-motion'

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
  navHint?: string
  mode?: string | null
  onNavClick?: (sectionId: string) => void
}

const sectionLabels: Record<string, string> = {
  hero: 'Home',
  about: 'About',
  experience: 'Experience',
  projects: 'Projects',
  publications: 'Publications',
  contact: 'Contact',
}

export default function ChatBubble({ role, content, navHint, mode, onNavClick }: ChatBubbleProps) {
  const isUser = role === 'user'

  const userBg = mode === 'xr' ? 'bg-teal-600/80' : 'bg-purple-600/80'
  const aiBg = 'bg-white/5 border border-white/10'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ 
        type: 'spring', 
        damping: 20, 
        stiffness: 100,
        opacity: { duration: 0.4 },
        filter: { duration: 0.4 }
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4 group`}
    >
      <div
        className={`max-w-[85%] rounded-[1.25rem] px-4 py-2.5 text-sm leading-relaxed transition-all duration-500 ${
          isUser 
            ? 'bg-white/10 text-white shadow-sm backdrop-blur-md' 
            : 'bg-transparent text-white/90'
        }`}
      >
        <div className={`flex flex-col gap-1 ${!isUser ? 'items-start text-left w-full' : ''}`}>
          {content ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`whitespace-pre-wrap ${!isUser ? 'text-[15px] font-normal tracking-normal leading-relaxed' : ''}`}
            >
              {content}
            </motion.div>
          ) : (
            <div className="flex gap-1 py-1">
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, times: [0, 0.5, 1] }} className="w-1.5 h-1.5 rounded-full bg-current" />
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.2, times: [0, 0.5, 1] }} className="w-1.5 h-1.5 rounded-full bg-current" />
              <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.4, times: [0, 0.5, 1] }} className="w-1.5 h-1.5 rounded-full bg-current" />
            </div>
          )}
        </div>

        {navHint && sectionLabels[navHint] && (
          <button
            onClick={() => onNavClick?.(navHint)}
            className={`mt-2 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-colors ${
              mode === 'xr'
                ? 'border-teal-500/40 text-teal-400 hover:bg-teal-500/10'
                : 'border-purple-500/40 text-purple-400 hover:bg-purple-500/10'
            }`}
          >
            Go to {sectionLabels[navHint]}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        )}
      </div>
    </motion.div>
  )
}

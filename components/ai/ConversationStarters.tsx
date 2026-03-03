'use client'

import { motion } from 'framer-motion'

interface ConversationStartersProps {
  starters: string[]
  onSelect: (question: string) => void
  mode?: string | null
}

export default function ConversationStarters({ starters, onSelect, mode }: ConversationStartersProps) {
  const accentBorder = mode === 'xr' ? 'border-teal-500/30 hover:border-teal-500/60' : 'border-purple-500/30 hover:border-purple-500/60'
  const accentText = mode === 'xr' ? 'text-teal-400' : 'text-purple-400'

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3">
      {starters.map((question, i) => (
        <motion.button
          key={question}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.08 }}
          onClick={() => onSelect(question)}
          className={`px-3 py-1.5 text-xs rounded-full border ${accentBorder} ${accentText} bg-background/50 hover:bg-background/80 transition-all cursor-pointer`}
        >
          {question}
        </motion.button>
      ))}
    </div>
  )
}

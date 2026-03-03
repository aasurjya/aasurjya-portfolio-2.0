'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import CartoonAvatar from './CartoonAvatar'

interface FloatingBubbleProps {
  isSpeaking: boolean
  amplitude: number
  mode?: string | null
  onRestore: () => void
  onClose: () => void
}

export default function FloatingBubble({
  isSpeaking,
  amplitude,
  mode,
  onRestore,
  onClose,
}: FloatingBubbleProps) {
  const constraintsRef = useRef<HTMLDivElement>(null)

  const accentColor = mode === 'xr' ? 'rgba(20,184,166,0.6)' : 'rgba(139,92,246,0.6)'

  return (
    <>
      {/* Invisible full-screen constraint boundary */}
      <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.3 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onTap={onRestore}
        className="fixed bottom-6 right-6 z-50 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      >
        {/* Speaking glow ring */}
        {isSpeaking && (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full"
            style={{ background: accentColor, filter: 'blur(12px)' }}
          />
        )}

        {/* Bubble body */}
        <div className="relative w-[72px] h-[72px] rounded-full bg-black/70 backdrop-blur-2xl border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex items-center justify-center overflow-hidden">
          {/* Scaled-down avatar */}
          <div className="transform scale-[0.55] pointer-events-none">
            <CartoonAvatar
              amplitude={amplitude}
              isSpeaking={isSpeaking}
              playful
              mode={mode}
            />
          </div>
        </div>

        {/* Close X button */}
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/80 transition-all z-10"
        >
          <X className="w-3 h-3" />
        </button>
      </motion.div>
    </>
  )
}

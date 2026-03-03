'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Minus } from 'lucide-react'
import CartoonAvatar from './CartoonAvatar'
import type { ChatMessage } from '@/hooks/use-aasurjya-ai'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import ConversationStarters from './ConversationStarters'
import VoiceOutput from './VoiceOutput'
import { buildPersonalizedGreeting } from '@/lib/ai-context-builder'

interface ChatPanelProps {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  isVoiceEnabled: boolean
  isSpeaking: boolean
  amplitude: number
  starters: string[]
  mode?: string | null
  onSend: (message: string, voiceUsed?: boolean) => void
  onClose: () => void
  onMinimize: () => void
  onVoiceToggle: () => void
  onStarterSelect: (question: string) => void
  onNavClick: (sectionId: string) => void
}

export default function ChatPanel({
  messages,
  isLoading,
  error,
  isVoiceEnabled,
  isSpeaking,
  amplitude,
  starters,
  mode,
  onSend,
  onClose,
  onMinimize,
  onVoiceToggle,
  onStarterSelect,
  onNavClick,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [messages, isLoading])

  const accentGradient = mode === 'xr'
    ? 'from-teal-500/20 to-emerald-500/10'
    : 'from-purple-500/20 to-indigo-500/10'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed z-40 flex flex-col items-center justify-between border border-white/10 bg-black/60 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden max-sm:inset-x-0 max-sm:bottom-0 max-sm:h-[85vh] max-sm:rounded-t-[3rem] sm:bottom-8 sm:right-8 sm:w-[420px] sm:h-[600px] sm:rounded-[2.5rem]"
    >
      {/* Background Gradient */}
      <motion.div 
        animate={{ 
          opacity: isSpeaking ? 0.6 : 0.2,
          scale: isSpeaking ? 1.1 : 1
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        className={`absolute inset-0 bg-gradient-to-b ${accentGradient} pointer-events-none opacity-40`}
      />

      {/* Top Section: Header & Avatar */}
      <div className="w-full flex flex-col items-center pt-6 pb-2 z-10 bg-gradient-to-b from-black/80 to-transparent relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <VoiceOutput isVoiceEnabled={isVoiceEnabled} onToggle={onVoiceToggle} />
          <button
            onClick={onMinimize}
            className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md"
            aria-label="Minimize chat"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10 backdrop-blur-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex flex-col items-center gap-1 mt-2">
          <CartoonAvatar
            amplitude={amplitude}
            isSpeaking={isSpeaking}
            mode={mode}
          />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/40 mt-3">Aasurjya AI</span>
          <span className="text-xs font-medium text-white/80">
            {isSpeaking ? 'Speaking...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Middle Section: Chat Messages */}
      <div 
        ref={scrollRef} 
        className="relative z-10 flex-1 w-full overflow-y-auto px-6 py-2 space-y-5 scroll-smooth mask-fade-edges scrollbar-none"
        style={{ maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)' }}
      >
        {messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex flex-col items-center justify-center text-center px-4"
          >
            <p className="text-[15px] font-normal text-white/70 leading-relaxed max-w-[85%]">
              {buildPersonalizedGreeting()}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6 pb-4">
            {messages.map(msg => (
              <ChatBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                navHint={msg.navHint}
                mode={mode}
                onNavClick={onNavClick}
              />
            ))}
          </div>
        )}
        
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex justify-center py-2">
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }} 
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-[10px] font-bold tracking-widest uppercase text-white/40"
            >
              Thinking
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Section: Voice Input & Visualizer */}
      <div className="w-full relative z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-4 pb-6 px-6 flex flex-col items-center gap-2">
        <div className="w-full flex justify-center">
          <ChatInput
            onSend={onSend}
            isLoading={isLoading}
            isSpeaking={isSpeaking}
          />
        </div>
      </div>
    </motion.div>
  )
}

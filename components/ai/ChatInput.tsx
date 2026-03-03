'use client'

import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string, voiceUsed?: boolean) => void
  isLoading: boolean
  isSpeaking?: boolean
}

export default function ChatInput({
  onSend,
  isLoading,
  isSpeaking = false,
}: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [input, isLoading, onSend])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const handleInput = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 100) + 'px'
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[340px]">

      <div className="flex flex-col items-center justify-center min-h-[100px] w-full">
        <AnimatePresence mode="wait">
          {isSpeaking && (
            <motion.span
              key="speaking"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-[10px] uppercase tracking-widest text-white/60 font-semibold"
            >
              Speaking...
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Text Input Area */}
      <div className="relative w-full group mt-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Type a message..."
          rows={1}
          className="w-full resize-none bg-white/[0.04] border border-white/10 rounded-full pl-6 pr-12 py-3 text-[13px] text-white/90 outline-none transition-all duration-300 placeholder:text-white/30 hover:bg-white/[0.06] focus:bg-white/[0.08] focus:border-white/20 shadow-inner backdrop-blur-sm"
          disabled={isLoading}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              input.trim() && !isLoading
                ? `bg-white text-black scale-100 opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.3)]`
                : 'bg-white/5 text-white/30 scale-90 opacity-0 pointer-events-none'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

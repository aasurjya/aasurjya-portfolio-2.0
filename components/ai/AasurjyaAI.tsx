'use client'

import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useMode } from '@/components/providers/mode-provider'
import { useAasurjyaAI } from '@/hooks/use-aasurjya-ai'
import { useVoiceOutput } from '@/hooks/use-voice-output'
import { useLipSync } from '@/hooks/use-lip-sync'
import { useSectionObserver } from '@/hooks/use-section-observer'
import { buildPersonalizedGreeting, getConversationStarters } from '@/lib/ai-context-builder'
import AIChatTrigger from './AIChatTrigger'
import ChatPanel from './ChatPanel'
import FloatingBubble from './FloatingBubble'

export default function AasurjyaAI() {
  const { mode } = useMode()
  const currentSection = useSectionObserver()
  const greetedRef = useRef(false)
  const dragConstraintsRef = useRef<HTMLDivElement>(null)
  const bubblePosRef = useRef({ x: 0, y: 0 })

  const {
    messages,
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    isLoading,
    error,
    sendMessage,
  } = useAasurjyaAI({ currentSection, mode })

  const { isSpeaking, isVoiceEnabled, setIsVoiceEnabled, speakChunk, clearQueue, stop, audioRef } = useVoiceOutput()
  const { lipSync } = useLipSync(audioRef)

  // Progressive sentence-level TTS
  const spokenIndexRef = useRef(0)
  const speakingMessageIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isVoiceEnabled || !messages.length) return

    const last = messages[messages.length - 1]
    if (last.role !== 'assistant' || !last.content) return

    // Reset when a new assistant message starts
    if (last.id !== speakingMessageIdRef.current) {
      spokenIndexRef.current = 0
      speakingMessageIdRef.current = last.id
    }

    const unspoken = last.content.slice(spokenIndexRef.current)
    if (!unspoken) return

    if (isLoading) {
      // Still streaming — find complete sentences
      const sentencePattern = /[.!?](?:\s|$)/g
      let match: RegExpExecArray | null
      let lastEnd = 0

      while ((match = sentencePattern.exec(unspoken)) !== null) {
        lastEnd = match.index + match[0].length
      }

      if (lastEnd > 0) {
        const chunk = unspoken.slice(0, lastEnd)
        speakChunk(chunk)
        spokenIndexRef.current += lastEnd
      }
    } else {
      // Stream finished — speak any remaining text
      if (unspoken.trim()) {
        speakChunk(unspoken)
        spokenIndexRef.current = last.content.length
      }
    }
  }, [messages, isVoiceEnabled, isLoading, speakChunk])

  // Stop old audio when user sends a new message
  useEffect(() => {
    if (!messages.length) return
    const last = messages[messages.length - 1]
    if (last.role === 'user') {
      stop()
      spokenIndexRef.current = 0
      speakingMessageIdRef.current = null
    }
  }, [messages, stop])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setIsMinimized(false)
    stop()
    bubblePosRef.current = { x: 0, y: 0 }
  }, [setIsOpen, setIsMinimized, stop])

  const handleBubbleDragChange = useCallback((pos: { x: number; y: number }) => {
    bubblePosRef.current = pos
  }, [])

  const handleMinimize = useCallback(() => {
    setIsMinimized(true)
  }, [setIsMinimized])

  const handleRestore = useCallback(() => {
    setIsMinimized(false)
  }, [setIsMinimized])

  const handleVoiceToggle = useCallback(() => {
    if (isVoiceEnabled) {
      stop()
    }
    setIsVoiceEnabled(!isVoiceEnabled)
  }, [isVoiceEnabled, setIsVoiceEnabled, stop])

  const handleNavClick = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  const handleSend = useCallback((message: string) => {
    setIsVoiceEnabled(true)
    sendMessage(message)
  }, [setIsVoiceEnabled, sendMessage])

  const handleStarterSelect = useCallback((question: string) => {
    setIsVoiceEnabled(true)
    sendMessage(question)
  }, [setIsVoiceEnabled, sendMessage])

  const starters = getConversationStarters(mode)

  return (
    <>
      <AIChatTrigger onClick={handleOpen} isOpen={isOpen} mode={mode} />
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            error={error}
            isVoiceEnabled={isVoiceEnabled}
            isSpeaking={isSpeaking}
            amplitude={lipSync.amplitude}
            starters={starters}
            mode={mode}
            onSend={handleSend}
            onClose={handleClose}
            onMinimize={handleMinimize}
            onVoiceToggle={handleVoiceToggle}
            onStarterSelect={handleStarterSelect}
            onNavClick={handleNavClick}
          />
        )}
      </AnimatePresence>
      {isOpen && isMinimized && (
        <div ref={dragConstraintsRef} className="fixed inset-0 z-50 pointer-events-none" />
      )}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <FloatingBubble
            isSpeaking={isSpeaking}
            amplitude={lipSync.amplitude}
            mode={mode}
            constraintsRef={dragConstraintsRef}
            initialPosition={bubblePosRef.current}
            onDragPositionChange={handleBubbleDragChange}
            onRestore={handleRestore}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  )
}

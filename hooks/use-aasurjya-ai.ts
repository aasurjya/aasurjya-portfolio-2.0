'use client'

import { useState, useCallback, useRef } from 'react'
import { getVisitorIdentity } from '@/lib/analytics'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  navHint?: string // e.g., 'projects'
}

interface UseAasurjyaAIOptions {
  currentSection?: string
  mode?: string | null
}

export function useAasurjyaAI({ currentSection, mode }: UseAasurjyaAIOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const conversationIdRef = useRef(crypto.randomUUID?.() || Math.random().toString(36).slice(2))
  const messageCountRef = useRef(0)

  const extractNavHint = (text: string): string | undefined => {
    const match = text.match(/\[NAV:(\w+)\]/)
    return match?.[1]
  }

  const cleanNavHints = (text: string): string => {
    return text.replace(/\s*\[NAV:\w+\]/g, '').trim()
  }

  const trackMessage = useCallback((userMessage: string, aiResponse: string, voiceUsed: boolean) => {
    try {
      const { visitorId, sessionId } = getVisitorIdentity()
      messageCountRef.current++
      navigator.sendBeacon?.('/api/ai/track', JSON.stringify({
        visitorId,
        sessionId,
        conversationId: conversationIdRef.current,
        messageCount: messageCountRef.current,
        userMessage: userMessage.slice(0, 200),
        aiResponse: aiResponse.slice(0, 500),
        voiceUsed,
        mode,
        currentSection,
      }))
    } catch {
      // Fire and forget
    }
  }, [mode, currentSection])

  const sendMessage = useCallback(async (content: string, voiceUsed = false) => {
    if (!content.trim() || isLoading) return

    setError(null)

    const userMessage: ChatMessage = {
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Create placeholder for assistant response
    const assistantId = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      abortRef.current = new AbortController()

      const allMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages, currentSection, mode }),
        signal: abortRef.current.signal,
      })

      if (res.status === 429) {
        const data = await res.json()
        setError(data.error || 'Please slow down.')
        setMessages(prev => prev.filter(m => m.id !== assistantId))
        setIsLoading(false)
        return
      }

      if (!res.ok) {
        throw new Error('Failed to get response')
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response stream')

      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.text) {
              fullText += parsed.text
              const navHint = extractNavHint(fullText)
              const cleanContent = cleanNavHints(fullText)

              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantId
                    ? { ...m, content: cleanContent, navHint }
                    : m
                )
              )
            }
          } catch {
            // Skip unparseable chunks
          }
        }
      }

      // Track after complete
      trackMessage(content, fullText, voiceUsed)
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      setError('Something went wrong. Please try again.')
      setMessages(prev => prev.filter(m => m.id !== assistantId))
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [messages, isLoading, currentSection, mode, trackMessage])

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort()
    setIsLoading(false)
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    messageCountRef.current = 0
    conversationIdRef.current = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  }, [])

  return {
    messages,
    isOpen,
    setIsOpen,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearMessages,
  }
}

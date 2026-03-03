import { NextRequest } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { buildSystemPrompt } from '@/lib/ai-system-prompt'

let ai: GoogleGenAI | null = null
function getAI(): GoogleGenAI {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
  }
  return ai
}

// In-memory rate limiting (per IP)
const rateLimits = new Map<string, { count: number; windowStart: number; hourCount: number; hourStart: number }>()

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now()
  const entry = rateLimits.get(ip) || { count: 0, windowStart: now, hourCount: 0, hourStart: now }

  // Reset minute window
  if (now - entry.windowStart > 60_000) {
    entry.count = 0
    entry.windowStart = now
  }

  // Reset hour window
  if (now - entry.hourStart > 3_600_000) {
    entry.hourCount = 0
    entry.hourStart = now
  }

  if (entry.count >= 20) {
    return { allowed: false, retryAfter: Math.ceil((entry.windowStart + 60_000 - now) / 1000) }
  }

  if (entry.hourCount >= 100) {
    return { allowed: false, retryAfter: Math.ceil((entry.hourStart + 3_600_000 - now) / 1000) }
  }

  entry.count++
  entry.hourCount++
  rateLimits.set(ip, entry)
  return { allowed: true }
}

// Clean stale entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  rateLimits.forEach((entry, ip) => {
    if (now - entry.windowStart > 3_600_000) rateLimits.delete(ip)
  })
}, 600_000)

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown'

    const { allowed, retryAfter } = checkRateLimit(ip)
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please slow down.', retryAfter }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(retryAfter) } }
      )
    }

    const { messages, currentSection, mode } = await req.json() as {
      messages: ChatMessage[]
      currentSection?: string
      mode?: string | null
    }

    if (!messages?.length) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), { status: 503 })
    }

    // Build conversation history (last 10 messages)
    const recentMessages = messages.slice(-10)

    const systemPrompt = buildSystemPrompt(currentSection, mode)

    // Build contents — Gemma doesn't support systemInstruction,
    // so we prepend the system prompt as the first user turn
    const contents = [
      { role: 'user' as const, parts: [{ text: `[SYSTEM INSTRUCTIONS — follow these strictly]\n${systemPrompt}\n[END SYSTEM INSTRUCTIONS]\n\nNow respond to the conversation below.` }] },
      { role: 'model' as const, parts: [{ text: 'Understood. I will follow these instructions and respond as Aasurjya AI.' }] },
      ...recentMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' as const : 'user' as const,
        parts: [{ text: msg.content }],
      })),
    ]

    let response
    try {
      response = await getAI().models.generateContentStream({
        model: 'gemma-3-27b-it',
        contents,
        config: {
          maxOutputTokens: 300,
          temperature: 0.7,
          topP: 0.9,
        },
      })
    } catch (geminiError: unknown) {
      const msg = geminiError instanceof Error ? geminiError.message : String(geminiError)
      // Check for quota/rate limit errors from Gemini
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        return new Response(
          JSON.stringify({ error: 'AI is temporarily busy. Please try again in a moment.' }),
          { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '30' } }
        )
      }
      throw geminiError
    }

    // Stream as SSE
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (err) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    const errStack = error instanceof Error ? error.stack : ''
    console.error('AI Chat error:', errMsg, errStack)
    return new Response(
      JSON.stringify({ error: 'Failed to process request', detail: errMsg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

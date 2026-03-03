import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      visitorId,
      sessionId,
      conversationId,
      messageCount,
      userMessage,
      aiResponse,
      voiceUsed,
      mode,
      currentSection,
    } = body

    const db = await getDatabase()
    await db.collection('ai_conversations').insertOne({
      visitorId: visitorId || null,
      sessionId: sessionId || null,
      conversationId: conversationId || null,
      messageCount: messageCount || 0,
      userMessage: userMessage || '',
      aiResponse: (aiResponse || '').slice(0, 500),
      voiceUsed: !!voiceUsed,
      mode: mode || null,
      currentSection: currentSection || null,
      timestamp: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('AI track error:', error)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}

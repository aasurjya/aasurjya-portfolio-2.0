import { NextRequest } from 'next/server'

const TTS_CHAR_LIMIT = 500

export async function POST(req: NextRequest) {
  try {
    const voiceA = process.env.ELEVENLABS_VOICE_ID_a
    const voiceB = process.env.ELEVENLABS_VOICE_ID_b

    if (!process.env.ELEVENLABS_API_KEY || !voiceA) {
      return new Response(JSON.stringify({ error: 'TTS not configured' }), { status: 503 })
    }

    const { text, voice } = await req.json() as { text: string; voice?: 'a' | 'b' }

    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: 'No text provided' }), { status: 400 })
    }

    const truncated = text.slice(0, TTS_CHAR_LIMIT)

    // Pick voice: use B if requested and available, otherwise fall back to A
    const voiceId = (voice === 'b' && voiceB) ? voiceB : voiceA

    // Use ElevenLabs streaming endpoint with flash model + high-quality output format
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: truncated,
          model_id: 'eleven_flash_v2_5',
          optimize_streaming_latency: 2,
        }),
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error('ElevenLabs API error:', res.status, errText)
      return new Response(
        JSON.stringify({ error: 'TTS generation failed', detail: errText }),
        { status: res.status, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Pipe the streaming response body directly to the client
    return new Response(res.body, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('TTS error:', errMsg)
    return new Response(
      JSON.stringify({ error: 'TTS generation failed', detail: errMsg }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

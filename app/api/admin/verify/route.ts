import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is required')
  return secret
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    try {
      const decoded = jwt.verify(token, getJwtSecret())
      return NextResponse.json({ valid: true, decoded })
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

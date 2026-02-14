import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$defaulthash'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is required')
  return secret
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    const validPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
    
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    const token = jwt.sign(
      { admin: true, timestamp: Date.now() },
      getJwtSecret(),
      { expiresIn: '24h' }
    )
    
    return NextResponse.json({ token })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

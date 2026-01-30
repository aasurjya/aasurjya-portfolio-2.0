import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$defaulthash'
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // For demo purposes, accept 'admin123' as password
    const validPassword = password === 'admin123' || 
                         await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
    
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
    
    const token = jwt.sign(
      { admin: true, timestamp: Date.now() },
      JWT_SECRET,
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

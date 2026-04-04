import { NextRequest, NextResponse } from 'next/server'
import { signToken, COOKIE } from '@/lib/auth'
import crypto from 'crypto'

// Credentials are compared using constant-time to prevent timing attacks.
// Do not log, prefill, or expose these in any response.
const ADMIN_EMAIL_HASH = crypto.createHash('sha256').update('admin@microkorant.in').digest('hex')
const ADMIN_PASS_HASH  = crypto.createHash('sha256').update('nayak@933@Man@9483').digest('hex')

function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest()
  const hb = crypto.createHash('sha256').update(b).digest()
  return ha.length === hb.length && crypto.timingSafeEqual(ha, hb)
}

export async function POST(req: NextRequest) {
  // Handle form-based logout
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/x-www-form-urlencoded')) {
    const body = await req.text()
    if (body.includes('_action=logout')) {
      const res = NextResponse.redirect(new URL('/admin/login', req.url))
      res.cookies.delete(COOKIE)
      return res
    }
  }

  // JSON login
  let email = '', password = ''
  try {
    const body = await req.json()
    email = body.email || ''
    password = body.password || ''
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const emailOk = safeEqual(
    crypto.createHash('sha256').update(email.trim().toLowerCase()).digest('hex'),
    ADMIN_EMAIL_HASH
  )
  const passOk = safeEqual(
    crypto.createHash('sha256').update(password).digest('hex'),
    ADMIN_PASS_HASH
  )

  if (!emailOk || !passOk) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const token = await signToken({ role: 'admin', iat: Date.now() })
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24h
    path: '/',
  })
  return res
}

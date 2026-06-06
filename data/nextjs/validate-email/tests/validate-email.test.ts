import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/validate-email/route'

describe('validate-email GET', () => {
  it('returns valid=true for a well-formed email', async () => {
    const res = await GET(new Request('http://x/api/validate-email?email=user@example.com'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ email: 'user@example.com', valid: true })
  })

  it('returns valid=false for string without @', async () => {
    const res = await GET(new Request('http://x/api/validate-email?email=notanemail'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ email: 'notanemail', valid: false })
  })

  it('returns valid=false for empty string', async () => {
    const res = await GET(new Request('http://x/api/validate-email?email='))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual({ email: '', valid: false })
  })

  it('returns 400 when email param is missing', async () => {
    const res = await GET(new Request('http://x/api/validate-email'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body).toEqual({ error: 'email query parameter is required' })
  })

  it('returns valid=false for email with space', async () => {
    const res = await GET(new Request('http://x/api/validate-email?email=user%20@example.com'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.valid).toBe(false)
  })

  it('returns valid=false for missing domain dot', async () => {
    const res = await GET(new Request('http://x/api/validate-email?email=user@nodot'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.valid).toBe(false)
  })

  it('returns valid=true for subdomain email', async () => {
    const res = await GET(new Request('http://x/api/validate-email?email=a@b.c.org'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.valid).toBe(true)
  })

  it('returns valid=false for multiple @ signs', async () => {
    const res = await GET(new Request('http://x/api/validate-email?email=a@b@c.com'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.valid).toBe(false)
  })
})

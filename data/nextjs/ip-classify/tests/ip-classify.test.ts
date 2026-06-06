import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/ip-classify/route'

describe('GET /api/ip-classify', () => {
  it('classifies a private Class C address', async () => {
    const res = await GET(new Request('http://x/api/ip-classify?ip=192.168.1.1'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ip).toBe('192.168.1.1')
    expect(body.class).toBe('C')
    expect(body.private).toBe(true)
  })

  it('classifies a public Class A address', async () => {
    const res = await GET(new Request('http://x/api/ip-classify?ip=8.8.8.8'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.class).toBe('A')
    expect(body.private).toBe(false)
  })

  it('classifies 10.x.x.x as private Class A', async () => {
    const res = await GET(new Request('http://x/api/ip-classify?ip=10.0.0.1'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.class).toBe('A')
    expect(body.private).toBe(true)
  })

  it('classifies 172.16.x.x as private Class B', async () => {
    const res = await GET(new Request('http://x/api/ip-classify?ip=172.16.0.1'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.class).toBe('B')
    expect(body.private).toBe(true)
  })

  it('classifies loopback 127.0.0.1 as private Class A', async () => {
    const res = await GET(new Request('http://x/api/ip-classify?ip=127.0.0.1'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.class).toBe('A')
    expect(body.private).toBe(true)
  })

  it('returns 400 when ip is missing', async () => {
    const res = await GET(new Request('http://x/api/ip-classify'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('ip is required')
  })

  it('returns 400 for invalid format', async () => {
    const res = await GET(new Request('http://x/api/ip-classify?ip=999.999.999.999'))
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('invalid IPv4 address')
  })

  it('classifies a Class D address', async () => {
    const res = await GET(new Request('http://x/api/ip-classify?ip=224.0.0.1'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.class).toBe('D')
    expect(body.private).toBe(false)
  })
})

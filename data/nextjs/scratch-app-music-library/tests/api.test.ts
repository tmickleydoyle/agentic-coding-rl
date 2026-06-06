import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET, POST, DELETE } from '../reference/app/api/music/route'

beforeEach(() => __reset())

describe('Music Library API', () => {
  it('GET /api/music returns 5 seed tracks', async () => {
    const req = new Request('http://localhost/api/music')
    const res = await GET(req)
    const data = await res.json()
    expect(data.tracks.length).toBe(5)
  })

  it('POST /api/music creates a track', async () => {
    const req = new Request('http://localhost/api/music', {
      method: 'POST',
      body: JSON.stringify({ title: 'Space Oddity', artist: 'David Bowie', album: 'Space Oddity', duration: 315 }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const t = await res.json()
    expect(t.title).toBe('Space Oddity')
  })

  it('POST /api/music returns 400 for missing title', async () => {
    const req = new Request('http://localhost/api/music', {
      method: 'POST',
      body: JSON.stringify({ artist: 'Test' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET /api/music/queue returns 2 seed items', async () => {
    const req = new Request('http://localhost/api/music/queue')
    const res = await GET(req)
    const data = await res.json()
    expect(data.queue.length).toBe(2)
  })

  it('POST /api/music/queue adds item', async () => {
    const req = new Request('http://localhost/api/music/queue', {
      method: 'POST',
      body: JSON.stringify({ trackId: 't2' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const item = await res.json()
    expect(item.trackId).toBe('t2')
  })

  it('DELETE /api/music/queue removes item', async () => {
    const req = new Request('http://localhost/api/music/queue?id=q1', { method: 'DELETE' })
    const res = await DELETE(req)
    const data = await res.json()
    expect(data.success).toBe(true)
    const getReq = new Request('http://localhost/api/music/queue')
    const getRes = await GET(getReq)
    const getData = await getRes.json()
    expect(getData.queue.length).toBe(1)
  })
})

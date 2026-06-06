import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET, POST } from '../reference/app/api/habits/route'

beforeEach(() => __reset())

describe('Habits API', () => {
  it('GET /api/habits returns 3 seed habits', async () => {
    const req = new Request('http://localhost/api/habits')
    const res = await GET(req)
    const data = await res.json()
    expect(data.habits.length).toBe(3)
  })

  it('POST /api/habits creates a habit', async () => {
    const req = new Request('http://localhost/api/habits', {
      method: 'POST',
      body: JSON.stringify({ name: 'Yoga', frequency: 'daily', category: 'Health' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const h = await res.json()
    expect(h.name).toBe('Yoga')
  })

  it('POST /api/habits returns 400 for missing name', async () => {
    const req = new Request('http://localhost/api/habits', {
      method: 'POST',
      body: JSON.stringify({ category: 'Test' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET /api/habits/logs returns 3 seed logs', async () => {
    const req = new Request('http://localhost/api/habits/logs')
    const res = await GET(req)
    const data = await res.json()
    expect(data.logs.length).toBe(3)
  })

  it('POST /api/habits/logs creates a log entry', async () => {
    const req = new Request('http://localhost/api/habits/logs', {
      method: 'POST',
      body: JSON.stringify({ habitId: 'h2', date: '2026-06-06', completed: true }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const log = await res.json()
    expect(log.habitId).toBe('h2')
  })

  it('POST /api/habits/logs returns 400 for missing habitId', async () => {
    const req = new Request('http://localhost/api/habits/logs', {
      method: 'POST',
      body: JSON.stringify({ date: '2026-06-06' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })
})

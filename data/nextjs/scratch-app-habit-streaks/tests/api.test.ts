import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, computeStreak, TODAY } from '../reference/lib/store'
import { GET, POST } from '../reference/app/api/habits/route'

beforeEach(() => __reset())

describe('Habit Streaks API', () => {
  it('GET /api/habits returns seed habits', async () => {
    const req = new Request('http://localhost/api/habits')
    const res = await GET(req)
    const data = await res.json()
    expect(data.habits.length).toBe(3)
  })

  it('POST /api/habits creates a habit', async () => {
    const req = new Request('http://localhost/api/habits', {
      method: 'POST',
      body: JSON.stringify({ name: 'Walking', color: 'green' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const h = await res.json()
    expect(h.name).toBe('Walking')
  })

  it('POST /api/habits returns 400 for missing name', async () => {
    const req = new Request('http://localhost/api/habits', {
      method: 'POST',
      body: JSON.stringify({ color: 'blue' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET /api/habits/completions returns 6 seed completions', async () => {
    const req = new Request('http://localhost/api/habits/completions')
    const res = await GET(req)
    const data = await res.json()
    expect(data.completions.length).toBe(6)
  })

  it('POST /api/habits/completions creates completion', async () => {
    const req = new Request('http://localhost/api/habits/completions', {
      method: 'POST',
      body: JSON.stringify({ habitId: 'h3', date: '2026-06-06' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const c = await res.json()
    expect(c.habitId).toBe('h3')
  })

  it('computeStreak returns correct streak for h1', () => {
    expect(computeStreak('h1', TODAY)).toBe(3)
  })

  it('computeStreak returns 0 for h3 (last 2026-06-01)', () => {
    expect(computeStreak('h3', TODAY)).toBe(0)
  })
})

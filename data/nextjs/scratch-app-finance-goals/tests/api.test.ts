import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../lib/store'
import { GET, POST } from '../app/api/goals/route'

beforeEach(() => __reset())

describe('Goals API', () => {
  it('GET /api/goals returns seed goals', async () => {
    const req = new Request('http://localhost/api/goals')
    const res = await GET(req)
    const data = await res.json()
    expect(data.goals.length).toBe(3)
  })

  it('POST /api/goals creates a goal', async () => {
    const req = new Request('http://localhost/api/goals', {
      method: 'POST',
      body: JSON.stringify({ name: 'Trip', targetAmount: 2000, currentAmount: 0, deadline: '2027-01-01', category: 'Travel' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const goal = await res.json()
    expect(goal.name).toBe('Trip')
  })

  it('POST /api/goals returns 400 for missing fields', async () => {
    const req = new Request('http://localhost/api/goals', {
      method: 'POST',
      body: JSON.stringify({ name: 'Bad' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET /api/goals/budget returns seed budget entries', async () => {
    const req = new Request('http://localhost/api/goals/budget')
    const res = await GET(req)
    const data = await res.json()
    expect(data.entries.length).toBe(2)
  })

  it('POST /api/goals/budget creates entry', async () => {
    const req = new Request('http://localhost/api/goals/budget', {
      method: 'POST',
      body: JSON.stringify({ category: 'Utilities', amount: 200, month: '2026-07' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const entry = await res.json()
    expect(entry.category).toBe('Utilities')
  })

  it('GET /api/goals after POST shows new goal', async () => {
    const postReq = new Request('http://localhost/api/goals', {
      method: 'POST',
      body: JSON.stringify({ name: 'Boat', targetAmount: 50000, currentAmount: 0, deadline: '2030-01-01', category: 'Luxury' }),
    })
    await POST(postReq)
    const getReq = new Request('http://localhost/api/goals')
    const res = await GET(getReq)
    const data = await res.json()
    expect(data.goals.length).toBe(4)
  })
})

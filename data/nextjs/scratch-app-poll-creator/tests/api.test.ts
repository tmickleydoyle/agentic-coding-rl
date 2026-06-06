import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET, POST } from '../reference/app/api/polls/route'

beforeEach(() => __reset())

describe('Polls API', () => {
  it('GET /api/polls returns 3 seed polls', async () => {
    const req = new Request('http://localhost/api/polls')
    const res = await GET(req)
    const data = await res.json()
    expect(data.polls.length).toBe(3)
  })

  it('POST /api/polls creates a poll', async () => {
    const req = new Request('http://localhost/api/polls', {
      method: 'POST',
      body: JSON.stringify({ question: 'Best food?', options: ['Pizza', 'Sushi'] }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const p = await res.json()
    expect(p.question).toBe('Best food?')
    expect(p.options.length).toBe(2)
  })

  it('POST /api/polls returns 400 for missing question', async () => {
    const req = new Request('http://localhost/api/polls', {
      method: 'POST',
      body: JSON.stringify({ options: ['A', 'B'] }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET /api/polls/votes returns 6 seed votes', async () => {
    const req = new Request('http://localhost/api/polls/votes')
    const res = await GET(req)
    const data = await res.json()
    expect(data.votes.length).toBe(6)
  })

  it('POST /api/polls/votes creates a vote', async () => {
    const req = new Request('http://localhost/api/polls/votes', {
      method: 'POST',
      body: JSON.stringify({ pollId: 'p3', option: 'Summer' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const v = await res.json()
    expect(v.option).toBe('Summer')
  })

  it('GET /api/polls/votes after POST includes new vote', async () => {
    const postReq = new Request('http://localhost/api/polls/votes', {
      method: 'POST',
      body: JSON.stringify({ pollId: 'p3', option: 'Winter' }),
    })
    await POST(postReq)
    const getReq = new Request('http://localhost/api/polls/votes')
    const res = await GET(getReq)
    const data = await res.json()
    expect(data.votes.length).toBe(7)
  })
})

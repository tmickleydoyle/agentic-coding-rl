import { it, expect, beforeEach } from 'vitest'
import { GET, POST, DELETE, __reset } from '../app/api/funnel/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded steps in order', async () => {
  const res = await GET(req('http://x/api/funnel'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.steps.map((s: { id: string }) => s.id)).toEqual(['st1', 'st2', 'st3', 'st4'])
})

it('GET rows=1 computes the all-segment funnel rows', async () => {
  const res = await GET(req('http://x/api/funnel?rows=1'))
  const body = await res.json()
  expect(body.rows).toEqual([
    { id: 'st1', name: 'Visit', count: 1000, dropOff: 0, conversion: 100 },
    { id: 'st2', name: 'Signup', count: 500, dropOff: 50, conversion: 50 },
    { id: 'st3', name: 'Activate', count: 300, dropOff: 40, conversion: 30 },
    { id: 'st4', name: 'Purchase', count: 120, dropOff: 60, conversion: 12 },
  ])
})

it('GET rows=1 with segment=mobile uses mobile counts', async () => {
  const res = await GET(req('http://x/api/funnel?rows=1&segment=mobile'))
  const body = await res.json()
  expect(body.rows[0].count).toBe(600)
  expect(body.rows[1].dropOff).toBe(58)
  expect(body.rows[3].conversion).toBe(7)
})

it('POST appends a step with the next order and returns 201', async () => {
  const res = await POST(
    req('http://x/api/funnel', {
      method: 'POST',
      body: JSON.stringify({ name: 'Refund', all: 20, mobile: 8, desktop: 12 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('st5')
  expect(body.order).toBe(5)
  expect(body.counts).toEqual({ all: 20, mobile: 8, desktop: 12 })
})

it('POST defaults mobile/desktop to 0', async () => {
  const res = await POST(
    req('http://x/api/funnel', { method: 'POST', body: JSON.stringify({ name: 'X', all: 5 }) }),
  )
  const body = await res.json()
  expect(body.counts).toEqual({ all: 5, mobile: 0, desktop: 0 })
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/funnel', { method: 'POST', body: JSON.stringify({ all: 5 }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST without a numeric all count returns 400', async () => {
  const res = await POST(
    req('http://x/api/funnel', { method: 'POST', body: JSON.stringify({ name: 'X' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'all count required' })
})

it('a created step then appears in GET', async () => {
  await POST(req('http://x/api/funnel', { method: 'POST', body: JSON.stringify({ name: 'Refund', all: 20 }) }))
  const res = await GET(req('http://x/api/funnel'))
  const body = await res.json()
  expect(body.steps.map((s: { id: string }) => s.id)).toEqual(['st1', 'st2', 'st3', 'st4', 'st5'])
})

it('DELETE removes a step', async () => {
  const del = await DELETE(req('http://x/api/funnel?id=st4', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/funnel'))
  const body = await res.json()
  expect(body.steps.map((s: { id: string }) => s.id)).toEqual(['st1', 'st2', 'st3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/funnel?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

import { it, expect, beforeEach } from 'vitest'
import { GET, __reset } from '../app/api/events/route'

beforeEach(() => __reset())

const req = (url: string) => new Request(url)

it('GET lists the seeded events', async () => {
  const res = await GET(req('http://x/api/events'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2'])
})

it('GET filters by id', async () => {
  const res = await GET(req('http://x/api/events?id=e2'))
  const body = await res.json()
  expect(body.events.map((e: { id: string }) => e.id)).toEqual(['e2'])
})

it('GET with an unknown id returns an empty array', async () => {
  const res = await GET(req('http://x/api/events?id=nope'))
  const body = await res.json()
  expect(body.events).toEqual([])
})

it('GET includes nested tier data', async () => {
  const res = await GET(req('http://x/api/events?id=e1'))
  const body = await res.json()
  expect(body.events[0].tiers.map((t: { id: string }) => t.id)).toEqual(['t1', 't2'])
})

import { it, expect, beforeEach } from 'vitest'
import { GET, __reset } from '../app/api/stats/route'
import { POST as createEvent, PUT as updateEvent } from '../app/api/events/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET reports totals and rsvp counts from seed', async () => {
  const res = await GET(req('http://x/api/stats'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.total).toBe(3)
  expect(body.upcoming).toBe(2)
  expect(body.past).toBe(1)
  expect(body.rsvpCounts).toEqual({ going: 1, maybe: 1, no: 0 })
})

it('rsvpCounts update after a PUT', async () => {
  await updateEvent(req('http://x/api/events?id=e2', { method: 'PUT', body: JSON.stringify({ rsvp: 'no' }) }))
  const res = await GET(req('http://x/api/stats'))
  const body = await res.json()
  expect(body.rsvpCounts.no).toBe(1)
})

it('totals grow and split by time after creating events', async () => {
  await createEvent(req('http://x/api/events', { method: 'POST', body: JSON.stringify({ title: 'Old', day: 10 }) }))
  await createEvent(req('http://x/api/events', { method: 'POST', body: JSON.stringify({ title: 'New', day: 200 }) }))
  const res = await GET(req('http://x/api/stats'))
  const body = await res.json()
  expect(body.total).toBe(5)
  expect(body.upcoming).toBe(3)
  expect(body.past).toBe(2)
})

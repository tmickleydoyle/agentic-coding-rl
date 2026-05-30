import { it, expect, beforeEach } from 'vitest'
import { GET, PUT, __reset } from '../app/api/units/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists units with the occupancy rate', async () => {
  const res = await GET(req('http://x/api/units'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.units.map((u: { id: string }) => u.id)).toEqual(['u1', 'u2', 'u3'])
  expect(body.occupancyRate).toBe(33)
})

it('GET filters units by occupied=true', async () => {
  const res = await GET(req('http://x/api/units?occupied=true'))
  const body = await res.json()
  expect(body.units.map((u: { id: string }) => u.id)).toEqual(['u1'])
  // rate still computed over all units
  expect(body.occupancyRate).toBe(33)
})

it('GET filters units by occupied=false', async () => {
  const res = await GET(req('http://x/api/units?occupied=false'))
  const body = await res.json()
  expect(body.units.map((u: { id: string }) => u.id)).toEqual(['u2', 'u3'])
})

it('PUT toggles a unit occupancy when no explicit value is given', async () => {
  const res = await PUT(req('http://x/api/units?id=u2', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.occupied).toBe(true)
})

it('PUT sets occupancy explicitly and changes the rate', async () => {
  await PUT(req('http://x/api/units?id=u2', { method: 'PUT', body: JSON.stringify({ occupied: true }) }))
  const res = await GET(req('http://x/api/units'))
  const body = await res.json()
  // u1 + u2 occupied of 3 => 67
  expect(body.occupancyRate).toBe(67)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/units?id=nope', { method: 'PUT', body: JSON.stringify({ occupied: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

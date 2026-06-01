import { it, expect, beforeEach } from 'vitest'
import {
  GET as APP_GET,
  POST as APP_POST,
  PUT as APP_PUT,
  __reset,
} from '../app/api/applications/route'
import { GET as UNIT_GET } from '../app/api/units/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded applications', async () => {
  const res = await APP_GET(req('http://x/api/applications'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.applications.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2', 'a3'])
})

it('GET filters applications by unitId', async () => {
  const res = await APP_GET(req('http://x/api/applications?unitId=u2'))
  const body = await res.json()
  expect(body.applications.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2'])
})

it('GET filters applications by status', async () => {
  const res = await APP_GET(req('http://x/api/applications?status=pending'))
  const body = await res.json()
  expect(body.applications.map((a: { id: string }) => a.id)).toEqual(['a1', 'a3'])
})

it('GET combines unitId and status filters with AND', async () => {
  const res = await APP_GET(req('http://x/api/applications?unitId=u2&status=rejected'))
  const body = await res.json()
  expect(body.applications.map((a: { id: string }) => a.id)).toEqual(['a2'])
})

it('POST creates a pending application and returns 201', async () => {
  const res = await APP_POST(
    req('http://x/api/applications', {
      method: 'POST',
      body: JSON.stringify({ unitId: 'u1', applicant: 'Nora' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('a4')
  expect(body.status).toBe('pending')
  expect(body.unitId).toBe('u1')
})

it('POST without an applicant returns 400', async () => {
  const res = await APP_POST(
    req('http://x/api/applications', { method: 'POST', body: JSON.stringify({ unitId: 'u1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'applicant required' })
})

it('POST with an unknown unit returns 404', async () => {
  const res = await APP_POST(
    req('http://x/api/applications', {
      method: 'POST',
      body: JSON.stringify({ unitId: 'nope', applicant: 'Nora' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'unit not found' })
})

it('PUT updates an application status', async () => {
  const res = await APP_PUT(
    req('http://x/api/applications?id=a1', { method: 'PUT', body: JSON.stringify({ status: 'rejected' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('rejected')
})

it('PUT approving an application marks its unit occupied (shared store)', async () => {
  await APP_PUT(
    req('http://x/api/applications?id=a3', { method: 'PUT', body: JSON.stringify({ status: 'approved' }) }),
  )
  const res = await UNIT_GET(req('http://x/api/units'))
  const body = await res.json()
  const u3 = body.units.find((u: { id: string }) => u.id === 'u3')
  expect(u3.occupied).toBe(true)
  // u1 + u3 occupied of 3 => 67
  expect(body.occupancyRate).toBe(67)
})

it('PUT with an invalid status returns 400', async () => {
  const res = await APP_PUT(
    req('http://x/api/applications?id=a1', { method: 'PUT', body: JSON.stringify({ status: 'maybe' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid status' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await APP_PUT(
    req('http://x/api/applications?id=nope', { method: 'PUT', body: JSON.stringify({ status: 'approved' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

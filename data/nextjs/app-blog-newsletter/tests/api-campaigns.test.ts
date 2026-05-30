import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/campaigns/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded campaigns', async () => {
  const res = await GET(req('http://x/api/campaigns'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.campaigns.map((c: { id: string }) => c.id)).toEqual(['m1', 'm2'])
})

it('GET filters by status', async () => {
  const res = await GET(req('http://x/api/campaigns?status=draft'))
  const body = await res.json()
  expect(body.campaigns.map((c: { id: string }) => c.id)).toEqual(['m2'])
})

it('POST creates a draft campaign and returns 201', async () => {
  const res = await POST(
    req('http://x/api/campaigns', { method: 'POST', body: JSON.stringify({ subject: 'Promo' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.subject).toBe('Promo')
  expect(body.status).toBe('draft')
  expect(body.recipients).toBe(0)
  expect(body.id).toBe('m3')
})

it('POST without a subject returns 400', async () => {
  const res = await POST(req('http://x/api/campaigns', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'subject required' })
})

it('PUT ?action=send marks the campaign sent and fills recipients/opens', async () => {
  const res = await PUT(req('http://x/api/campaigns?id=m2&action=send', { method: 'PUT' }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.status).toBe('sent')
  // 2 active subscribers in the seed; mock opens = round(2*0.5) = 1
  expect(body.recipients).toBe(2)
  expect(body.opens).toBe(1)
})

it('PUT without action=send returns 400', async () => {
  const res = await PUT(req('http://x/api/campaigns?id=m2', { method: 'PUT' }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'unsupported action' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/campaigns?id=zzz&action=send', { method: 'PUT' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a campaign', async () => {
  const del = await DELETE(req('http://x/api/campaigns?id=m1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/campaigns'))
  const body = await res.json()
  expect(body.campaigns.map((c: { id: string }) => c.id)).toEqual(['m2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/campaigns?id=zzz', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/deals/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded deals', async () => {
  const res = await GET(req('http://x/api/deals'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.deals.map((d: { id: string }) => d.id)).toEqual(['d1', 'd2', 'd3', 'd4'])
})

it('GET filters by stage', async () => {
  const res = await GET(req('http://x/api/deals?stage=lead'))
  const body = await res.json()
  expect(body.deals.map((d: { id: string }) => d.id)).toEqual(['d4'])
})

it('GET filters by contactId', async () => {
  const res = await GET(req('http://x/api/deals?contactId=c1'))
  const body = await res.json()
  expect(body.deals.map((d: { id: string }) => d.id)).toEqual(['d1', 'd4'])
})

it('GET rollup returns per-stage count and value', async () => {
  const res = await GET(req('http://x/api/deals?rollup=true'))
  const body = await res.json()
  const won = body.rollup.find((r: { stage: string }) => r.stage === 'won')
  expect(won).toEqual({ stage: 'won', count: 1, value: 8000 })
  const lead = body.rollup.find((r: { stage: string }) => r.stage === 'lead')
  expect(lead.value).toBe(3000)
})

it('POST creates a deal with defaults and returns 201', async () => {
  const res = await POST(
    req('http://x/api/deals', { method: 'POST', body: JSON.stringify({ title: 'New deal' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('New deal')
  expect(body.value).toBe(0)
  expect(body.stage).toBe('lead')
  expect(body.contactId).toBe('c1')
  expect(body.id).toBe('d5')
})

it('POST accepts value, stage and contactId', async () => {
  const res = await POST(
    req('http://x/api/deals', {
      method: 'POST',
      body: JSON.stringify({ title: 'Big', value: 9000, stage: 'proposal', contactId: 'c2' }),
    }),
  )
  const body = await res.json()
  expect(body.value).toBe(9000)
  expect(body.stage).toBe('proposal')
  expect(body.contactId).toBe('c2')
})

it('POST without a title returns 400', async () => {
  const res = await POST(req('http://x/api/deals', { method: 'POST', body: JSON.stringify({ value: 1 }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('POST ignores an invalid stage and falls back to lead', async () => {
  const res = await POST(
    req('http://x/api/deals', { method: 'POST', body: JSON.stringify({ title: 'X', stage: 'bogus' }) }),
  )
  const body = await res.json()
  expect(body.stage).toBe('lead')
})

it('PUT moves a deal to a new stage', async () => {
  const res = await PUT(
    req('http://x/api/deals?id=d1', { method: 'PUT', body: JSON.stringify({ stage: 'won' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.stage).toBe('won')
})

it('PUT updates the value', async () => {
  const res = await PUT(
    req('http://x/api/deals?id=d1', { method: 'PUT', body: JSON.stringify({ value: 7777 }) }),
  )
  const body = await res.json()
  expect(body.value).toBe(7777)
})

it('PUT ignores an invalid stage', async () => {
  const res = await PUT(
    req('http://x/api/deals?id=d1', { method: 'PUT', body: JSON.stringify({ stage: 'nope' }) }),
  )
  const body = await res.json()
  expect(body.stage).toBe('qualified')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/deals?id=nope', { method: 'PUT', body: JSON.stringify({ stage: 'won' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a deal', async () => {
  const del = await DELETE(req('http://x/api/deals?id=d1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/deals'))
  const body = await res.json()
  expect(body.deals.map((d: { id: string }) => d.id)).toEqual(['d2', 'd3', 'd4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/deals?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

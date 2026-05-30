import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/contacts/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded contacts', async () => {
  const res = await GET(req('http://x/api/contacts'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.contacts.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2', 'c3'])
})

it('GET filters by companyId', async () => {
  const res = await GET(req('http://x/api/contacts?companyId=co1'))
  const body = await res.json()
  expect(body.contacts.map((c: { id: string }) => c.id)).toEqual(['c1', 'c2'])
})

it('GET filters by tag', async () => {
  const res = await GET(req('http://x/api/contacts?tag=vip'))
  const body = await res.json()
  expect(body.contacts.map((c: { id: string }) => c.id)).toEqual(['c1'])
})

it('GET activity lists all activities', async () => {
  const res = await GET(req('http://x/api/contacts?activity=true'))
  const body = await res.json()
  expect(body.activities.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2', 'a3'])
})

it('GET activity filters by contactId', async () => {
  const res = await GET(req('http://x/api/contacts?activity=true&contactId=c1'))
  const body = await res.json()
  expect(body.activities.map((a: { id: string }) => a.id)).toEqual(['a1', 'a2'])
})

it('POST creates a contact with defaults and returns 201', async () => {
  const res = await POST(
    req('http://x/api/contacts', { method: 'POST', body: JSON.stringify({ name: 'New Person' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('New Person')
  expect(body.companyId).toBe('co1')
  expect(body.tags).toEqual([])
  expect(body.id).toBe('c4')
})

it('POST accepts companyId and tags', async () => {
  const res = await POST(
    req('http://x/api/contacts', {
      method: 'POST',
      body: JSON.stringify({ name: 'X', companyId: 'co2', tags: ['hot'] }),
    }),
  )
  const body = await res.json()
  expect(body.companyId).toBe('co2')
  expect(body.tags).toEqual(['hot'])
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/contacts', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST activity logs an activity and returns 201', async () => {
  const res = await POST(
    req('http://x/api/contacts?activity=true', {
      method: 'POST',
      body: JSON.stringify({ contactId: 'c3', kind: 'call', text: 'Rang them' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('a4')
  expect(body.kind).toBe('call')
  expect(body.text).toBe('Rang them')
})

it('POST activity with blank text returns 400', async () => {
  const res = await POST(
    req('http://x/api/contacts?activity=true', {
      method: 'POST',
      body: JSON.stringify({ contactId: 'c3', text: '  ' }),
    }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'text required' })
})

it('POST activity for a missing contact returns 404', async () => {
  const res = await POST(
    req('http://x/api/contacts?activity=true', {
      method: 'POST',
      body: JSON.stringify({ contactId: 'nope', text: 'Hi' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('PUT adds a tag to a contact', async () => {
  const res = await PUT(
    req('http://x/api/contacts?id=c3', { method: 'PUT', body: JSON.stringify({ tag: 'hot' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.tags).toContain('hot')
})

it('PUT op=remove drops a tag', async () => {
  const res = await PUT(
    req('http://x/api/contacts?id=c1&op=remove', { method: 'PUT', body: JSON.stringify({ tag: 'vip' }) }),
  )
  const body = await res.json()
  expect(body.tags).not.toContain('vip')
  expect(body.tags).toContain('lead')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(req('http://x/api/contacts?id=nope', { method: 'PUT', body: JSON.stringify({ tag: 'x' }) }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a contact and its activities', async () => {
  const del = await DELETE(req('http://x/api/contacts?id=c1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const list = await GET(req('http://x/api/contacts'))
  expect((await list.json()).contacts.map((c: { id: string }) => c.id)).toEqual(['c2', 'c3'])
  const acts = await GET(req('http://x/api/contacts?activity=true'))
  expect((await acts.json()).activities.map((a: { id: string }) => a.id)).toEqual(['a3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/contacts?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

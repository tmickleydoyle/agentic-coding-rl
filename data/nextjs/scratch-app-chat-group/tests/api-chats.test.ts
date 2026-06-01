import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/chats/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded groups', async () => {
  const res = await GET(req('http://x/api/chats'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.groups.map((g: { id: string }) => g.id)).toEqual(['g1', 'g2', 'g3'])
})

it('GET filters by memberId', async () => {
  const res = await GET(req('http://x/api/chats?memberId=u1'))
  const body = await res.json()
  expect(body.groups.map((g: { id: string }) => g.id)).toEqual(['g1', 'g2'])
})

it('POST creates a group and returns 201', async () => {
  const res = await POST(
    req('http://x/api/chats', { method: 'POST', body: JSON.stringify({ name: 'Trip', adminId: 'u1' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Trip')
  expect(body.adminId).toBe('u1')
  expect(body.memberIds).toEqual(['u1'])
  expect(body.id).toBe('g4')
})

it('POST without name returns 400', async () => {
  const res = await POST(
    req('http://x/api/chats', { method: 'POST', body: JSON.stringify({ adminId: 'u1' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST without adminId returns 400', async () => {
  const res = await POST(
    req('http://x/api/chats', { method: 'POST', body: JSON.stringify({ name: 'Trip' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'adminId required' })
})

it('PUT adds a member', async () => {
  const res = await PUT(
    req('http://x/api/chats?id=g3', { method: 'PUT', body: JSON.stringify({ add: 'u1' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.memberIds).toContain('u1')
})

it('PUT removes a non-admin member', async () => {
  const res = await PUT(
    req('http://x/api/chats?id=g1', { method: 'PUT', body: JSON.stringify({ remove: 'u2' }) }),
  )
  const body = await res.json()
  expect(body.memberIds).not.toContain('u2')
})

it('PUT cannot remove the admin', async () => {
  const res = await PUT(
    req('http://x/api/chats?id=g1', { method: 'PUT', body: JSON.stringify({ remove: 'u1' }) }),
  )
  const body = await res.json()
  expect(body.memberIds).toContain('u1')
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/chats?id=nope', { method: 'PUT', body: JSON.stringify({ add: 'u1' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a group', async () => {
  const del = await DELETE(req('http://x/api/chats?id=g1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/chats'))
  const body = await res.json()
  expect(body.groups.map((g: { id: string }) => g.id)).toEqual(['g2', 'g3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/chats?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

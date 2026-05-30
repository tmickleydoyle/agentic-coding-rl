import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/keys/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded keys with masked secrets', async () => {
  const res = await GET(req('http://x/api/keys'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.keys.map((k: { id: string }) => k.id)).toEqual(['k1', 'k2', 'k3'])
  expect(body.keys[0].secret).toBe('sk_l...1111')
  expect(body.keys[0].secret).not.toContain('aaaa')
})

it('GET filters by active status', async () => {
  const res = await GET(req('http://x/api/keys?status=active'))
  const body = await res.json()
  expect(body.keys.map((k: { id: string }) => k.id)).toEqual(['k1', 'k2'])
})

it('GET filters by revoked status', async () => {
  const res = await GET(req('http://x/api/keys?status=revoked'))
  const body = await res.json()
  expect(body.keys.map((k: { id: string }) => k.id)).toEqual(['k3'])
})

it('GET filters by scope', async () => {
  const res = await GET(req('http://x/api/keys?scope=write'))
  const body = await res.json()
  expect(body.keys.map((k: { id: string }) => k.id)).toEqual(['k1'])
})

it('GET combines status and scope filters', async () => {
  const res = await GET(req('http://x/api/keys?status=active&scope=read'))
  const body = await res.json()
  expect(body.keys.map((k: { id: string }) => k.id)).toEqual(['k1', 'k2'])
})

it('POST creates a key with masked secret and defaults', async () => {
  const res = await POST(
    req('http://x/api/keys', { method: 'POST', body: JSON.stringify({ name: 'New key' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('k4')
  expect(body.name).toBe('New key')
  expect(body.active).toBe(true)
  expect(body.usageCount).toBe(0)
  expect(body.scopes).toEqual(['read'])
  expect(body.secret).toBe('sk_k...cret') // sk_k4_secret masked
})

it('POST honors provided scopes', async () => {
  const res = await POST(
    req('http://x/api/keys', { method: 'POST', body: JSON.stringify({ name: 'Scoped', scopes: ['write', 'admin'] }) }),
  )
  const body = await res.json()
  expect(body.scopes).toEqual(['write', 'admin'])
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/keys', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT revoke deactivates a key', async () => {
  const res = await PUT(
    req('http://x/api/keys?id=k1', { method: 'PUT', body: JSON.stringify({ action: 'revoke' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.active).toBe(false)
})

it('PUT use increments usage', async () => {
  const res = await PUT(
    req('http://x/api/keys?id=k2', { method: 'PUT', body: JSON.stringify({ action: 'use' }) }),
  )
  const body = await res.json()
  expect(body.usageCount).toBe(5)
})

it('PUT with an unknown action returns 400', async () => {
  const res = await PUT(
    req('http://x/api/keys?id=k1', { method: 'PUT', body: JSON.stringify({ action: 'frobnicate' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'unknown action' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/keys?id=nope', { method: 'PUT', body: JSON.stringify({ action: 'use' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a key', async () => {
  const del = await DELETE(req('http://x/api/keys?id=k1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/keys'))
  const body = await res.json()
  expect(body.keys.map((k: { id: string }) => k.id)).toEqual(['k2', 'k3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/keys?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

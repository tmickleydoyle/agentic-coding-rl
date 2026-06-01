import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/users/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded users', async () => {
  const res = await GET(req('http://x/api/users'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.users.map((u: { id: string }) => u.id)).toEqual(['u1', 'u2', 'u3', 'u4'])
})

it('GET filters by case-insensitive name substring', async () => {
  const res = await GET(req('http://x/api/users?q=mi'))
  const body = await res.json()
  expect(body.users.map((u: { name: string }) => u.name)).toEqual(['Mia'])
})

it('POST creates a user and returns 201', async () => {
  const res = await POST(
    req('http://x/api/users', { method: 'POST', body: JSON.stringify({ name: 'Nova', bio: 'New here' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Nova')
  expect(body.bio).toBe('New here')
  expect(body.id).toBe('u5')
})

it('POST defaults bio to empty string', async () => {
  const res = await POST(
    req('http://x/api/users', { method: 'POST', body: JSON.stringify({ name: 'NoBio' }) }),
  )
  const body = await res.json()
  expect(body.bio).toBe('')
})

it('POST without a name returns 400', async () => {
  const res = await POST(req('http://x/api/users', { method: 'POST', body: JSON.stringify({ bio: 'x' }) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT updates a name and bio', async () => {
  const res = await PUT(
    req('http://x/api/users?id=u2', { method: 'PUT', body: JSON.stringify({ name: 'Omar B.', bio: 'Lead designer' }) }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.name).toBe('Omar B.')
  expect(body.bio).toBe('Lead designer')
})

it('PUT with only a bio leaves the name unchanged', async () => {
  const res = await PUT(
    req('http://x/api/users?id=u2', { method: 'PUT', body: JSON.stringify({ bio: 'Just bio' }) }),
  )
  const body = await res.json()
  expect(body.name).toBe('Omar')
  expect(body.bio).toBe('Just bio')
})

it('PUT with a blank name returns 400', async () => {
  const res = await PUT(
    req('http://x/api/users?id=u2', { method: 'PUT', body: JSON.stringify({ name: '   ' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/users?id=nope', { method: 'PUT', body: JSON.stringify({ name: 'X' }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a user', async () => {
  const del = await DELETE(req('http://x/api/users?id=u4', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/users'))
  const body = await res.json()
  expect(body.users.map((u: { id: string }) => u.id)).toEqual(['u1', 'u2', 'u3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/users?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

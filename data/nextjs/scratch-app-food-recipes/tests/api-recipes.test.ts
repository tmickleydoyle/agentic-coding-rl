import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/recipes/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded recipes', async () => {
  const res = await GET(req('http://x/api/recipes'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.recipes.map((r: { id: string }) => r.id)).toEqual(['r1', 'r2', 'r3', 'r4'])
})

it('GET filters by cuisine', async () => {
  const res = await GET(req('http://x/api/recipes?cuisine=Italian'))
  const body = await res.json()
  expect(body.recipes.map((r: { id: string }) => r.id)).toEqual(['r1', 'r4'])
})

it('GET filters by favorite=true', async () => {
  const res = await GET(req('http://x/api/recipes?favorite=true'))
  const body = await res.json()
  expect(body.recipes.map((r: { id: string }) => r.id)).toEqual(['r2'])
})

it('POST creates a recipe and returns 201', async () => {
  const res = await POST(
    req('http://x/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ title: 'Ramen', cuisine: 'Japanese', minutes: 50 }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.title).toBe('Ramen')
  expect(body.cuisine).toBe('Japanese')
  expect(body.favorite).toBe(false)
  expect(body.id).toBe('r5')
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/recipes', { method: 'POST', body: JSON.stringify({ cuisine: 'Thai' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('POST accepts ingredients and steps arrays', async () => {
  const res = await POST(
    req('http://x/api/recipes', {
      method: 'POST',
      body: JSON.stringify({ title: 'Soup', ingredients: ['water', 'salt'], steps: ['boil'] }),
    }),
  )
  const body = await res.json()
  expect(body.ingredients).toEqual(['water', 'salt'])
  expect(body.steps).toEqual(['boil'])
})

it('PUT toggles favorite when no explicit value is given', async () => {
  const res = await PUT(req('http://x/api/recipes?id=r1', { method: 'PUT', body: JSON.stringify({}) }))
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.id).toBe('r1')
  expect(body.favorite).toBe(true)
})

it('PUT sets favorite explicitly', async () => {
  const res = await PUT(
    req('http://x/api/recipes?id=r2', { method: 'PUT', body: JSON.stringify({ favorite: false }) }),
  )
  const body = await res.json()
  expect(body.favorite).toBe(false)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/recipes?id=nope', { method: 'PUT', body: JSON.stringify({ favorite: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a recipe', async () => {
  const del = await DELETE(req('http://x/api/recipes?id=r1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/recipes'))
  const body = await res.json()
  expect(body.recipes.map((r: { id: string }) => r.id)).toEqual(['r2', 'r3', 'r4'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/recipes?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

import { it, expect } from 'vitest'
import { GET, POST } from '../app/api/echo/route'

const post = (body: string) =>
  POST(new Request('http://x/api/echo', { method: 'POST', body }))

it('GET echoes query params', async () => {
  const res = await GET(new Request('http://x/api/echo?a=1&b=two'))
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ method: 'GET', query: { a: '1', b: 'two' } })
})

it('GET with no params returns empty query object', async () => {
  const res = await GET(new Request('http://x/api/echo'))
  expect(await res.json()).toEqual({ method: 'GET', query: {} })
})

it('GET sets json content-type', async () => {
  const res = await GET(new Request('http://x/api/echo'))
  expect(res.headers.get('content-type')).toBe('application/json')
})

it('POST echoes the parsed body under received', async () => {
  const res = await post(JSON.stringify({ x: 1, nested: { y: true } }))
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ received: { x: 1, nested: { y: true } } })
})

it('POST echoes arrays too', async () => {
  const res = await post(JSON.stringify([1, 2, 3]))
  expect(await res.json()).toEqual({ received: [1, 2, 3] })
})

it('POST with invalid JSON returns 400', async () => {
  const res = await post('{not json')
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid json' })
})

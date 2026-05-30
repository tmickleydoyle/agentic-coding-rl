import { it, expect, beforeEach } from 'vitest'
import { GET, __reset } from '../app/api/products/route'
import { POST as createReview } from '../app/api/reviews/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists products with average and count', async () => {
  const res = await GET(req('http://x/api/products'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  const p1 = body.products.find((p: { id: string }) => p.id === 'p1')
  expect(p1.average).toBe(4) // (5 + 3) / 2
  expect(p1.count).toBe(2)
})

it('reports average 0 and count 0 for a product with no reviews', async () => {
  const res = await GET(req('http://x/api/products'))
  const body = await res.json()
  const p3 = body.products.find((p: { id: string }) => p.id === 'p3')
  expect(p3.average).toBe(0)
  expect(p3.count).toBe(0)
})

it('average updates after a review is created', async () => {
  await createReview(
    req('http://x/api/reviews', { method: 'POST', body: JSON.stringify({ productId: 'p2', rating: 2, text: 'meh' }) }),
  )
  const res = await GET(req('http://x/api/products'))
  const body = await res.json()
  const p2 = body.products.find((p: { id: string }) => p.id === 'p2')
  expect(p2.average).toBe(3) // (4 + 2) / 2
  expect(p2.count).toBe(2)
})

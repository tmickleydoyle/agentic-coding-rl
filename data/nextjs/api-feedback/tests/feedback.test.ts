import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/feedback/route'

beforeEach(() => __reset())

const submit = (body: unknown) =>
  POST(new Request('http://x/api/feedback', { method: 'POST', body: JSON.stringify(body) }))
const stats = () => GET(new Request('http://x/api/feedback'))

it('GET is empty initially', async () => {
  const res = await stats()
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ count: 0, average: 0 })
})

it('accepts a valid rating', async () => {
  const res = await submit({ rating: 4 })
  expect(res.status).toBe(201)
  expect(await res.json()).toEqual({ ok: true })
})

it('accepts an optional comment', async () => {
  const res = await submit({ rating: 5, comment: 'great' })
  expect(res.status).toBe(201)
})

it('computes count and rounded average', async () => {
  await submit({ rating: 5 })
  await submit({ rating: 4 })
  await submit({ rating: 4 })
  const body = await (await stats()).json()
  expect(body.count).toBe(3)
  expect(body.average).toBe(4.3)
})

it('rejects out-of-range rating', async () => {
  const res = await submit({ rating: 6 })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid rating' })
})

it('rejects non-integer rating', async () => {
  const res = await submit({ rating: 3.5 })
  expect(res.status).toBe(400)
})

it('rejects missing rating', async () => {
  const res = await submit({ comment: 'hi' })
  expect(res.status).toBe(400)
})

it('reset clears stored feedback', async () => {
  await submit({ rating: 5 })
  __reset()
  expect(await (await stats()).json()).toEqual({ count: 0, average: 0 })
})

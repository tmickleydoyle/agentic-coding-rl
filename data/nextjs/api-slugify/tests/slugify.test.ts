import { it, expect } from 'vitest'
import { POST } from '../app/api/slugify/route'

const post = (body: unknown) =>
  POST(new Request('http://x/api/slugify', { method: 'POST', body: JSON.stringify(body) }))

it('slugifies a basic title', async () => {
  const res = await post({ title: 'Hello, World!' })
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ slug: 'hello-world' })
})

it('collapses whitespace and trims', async () => {
  const res = await post({ title: '  Foo   Bar  ' })
  expect(await res.json()).toEqual({ slug: 'foo-bar' })
})

it('collapses runs of symbols to a single dash', async () => {
  const res = await post({ title: 'a@@@b' })
  expect(await res.json()).toEqual({ slug: 'a-b' })
})

it('keeps digits', async () => {
  const res = await post({ title: 'Top 10 Tips' })
  expect(await res.json()).toEqual({ slug: 'top-10-tips' })
})

it('missing title returns 400', async () => {
  const res = await post({})
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('empty/whitespace title returns 400', async () => {
  const res = await post({ title: '   ' })
  expect(res.status).toBe(400)
})

it('symbol-only title returns 400', async () => {
  const res = await post({ title: '!!!' })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

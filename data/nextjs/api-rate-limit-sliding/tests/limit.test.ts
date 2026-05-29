import { it, expect, beforeEach } from 'vitest'
import { GET, __reset, __setNow } from '../app/api/limit/route'

beforeEach(() => __reset())

const hit = (key: string) => GET(new Request(`http://x/api/limit?key=${key}`))

it('missing key is 400', async () => {
  const res = await GET(new Request('http://x/api/limit'))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'key required' })
})

it('first request reports remaining LIMIT-1', async () => {
  __setNow(0)
  const res = await hit('a')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ remaining: 2 })
})

it('allows up to LIMIT requests in a window then 429', async () => {
  __setNow(0)
  expect((await (await hit('a')).json()).remaining).toBe(2)
  __setNow(100)
  expect((await (await hit('a')).json()).remaining).toBe(1)
  __setNow(200)
  expect((await (await hit('a')).json()).remaining).toBe(0)
  __setNow(300)
  const res = await hit('a')
  expect(res.status).toBe(429)
})

it('429 retryAfter is until the oldest in-window timestamp ages out', async () => {
  __setNow(0) // oldest
  await hit('a')
  __setNow(100)
  await hit('a')
  __setNow(200)
  await hit('a')
  __setNow(300)
  const res = await hit('a')
  // oldest=0, WINDOW=1000, t=300 -> 0+1000-300 = 700
  expect(await res.json()).toEqual({ retryAfter: 700 })
})

it('old timestamps age out of the window, freeing capacity', async () => {
  __setNow(0)
  await hit('a')
  __setNow(100)
  await hit('a')
  __setNow(200)
  await hit('a') // now at limit, 3 in window
  // advance so the t=0 entry ages out (cutoff = t-1000; ts>cutoff kept).
  // at t=1001: cutoff=1, ts=0 dropped, ts=100,200 remain (2) -> allowed
  __setNow(1001)
  const res = await hit('a')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ remaining: 0 }) // 100,200,1001 = 3 in window
})

it('a timestamp exactly WINDOW old has aged out', async () => {
  __setNow(0)
  await hit('a') // ts=0
  __setNow(1000) // cutoff = 0; ts=0 is NOT > 0, dropped
  const res = await hit('a')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ remaining: 2 })
})

it('denied requests do not consume capacity', async () => {
  __setNow(0)
  await hit('a')
  __setNow(10)
  await hit('a')
  __setNow(20)
  await hit('a') // at limit
  __setNow(30)
  expect((await hit('a')).status).toBe(429)
  __setNow(40)
  expect((await hit('a')).status).toBe(429)
  // oldest still 0; once it ages out at 1001 we get capacity, proving denies didn't log
  __setNow(1001)
  const res = await hit('a')
  expect(res.status).toBe(200)
})

it('separate keys have independent windows', async () => {
  __setNow(0)
  await hit('a')
  await hit('a')
  await hit('a')
  expect((await hit('a')).status).toBe(429)
  const res = await hit('b')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ remaining: 2 })
})

it('reset clears the log', async () => {
  __setNow(0)
  await hit('a')
  await hit('a')
  await hit('a')
  expect((await hit('a')).status).toBe(429)
  __reset()
  __setNow(0)
  const res = await hit('a')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ remaining: 2 })
})

it('empty key string is 400', async () => {
  const res = await hit('')
  expect(res.status).toBe(400)
})

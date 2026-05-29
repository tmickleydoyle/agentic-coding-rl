import { it, expect, beforeEach } from 'vitest'
import { GET, __reset } from '../app/api/limit/route'

beforeEach(() => __reset())

const hit = (key?: string) =>
  GET(new Request(`http://x/api/limit${key ? `?key=${key}` : ''}`))

it('returns incrementing counts up to the limit', async () => {
  expect(await (await hit('a')).json()).toEqual({ count: 1 })
  expect(await (await hit('a')).json()).toEqual({ count: 2 })
  expect(await (await hit('a')).json()).toEqual({ count: 3 })
})

it('rate limits after MAX', async () => {
  await hit('a')
  await hit('a')
  await hit('a')
  const res = await hit('a')
  expect(res.status).toBe(429)
  expect(await res.json()).toEqual({ error: 'rate limited' })
})

it('stays limited on subsequent requests', async () => {
  for (let i = 0; i < 3; i++) await hit('a')
  expect((await hit('a')).status).toBe(429)
  expect((await hit('a')).status).toBe(429)
})

it('tracks different keys independently', async () => {
  await hit('a')
  await hit('a')
  await hit('a')
  expect((await hit('a')).status).toBe(429)
  expect(await (await hit('b')).json()).toEqual({ count: 1 })
})

it('uses default key when none given', async () => {
  expect(await (await hit()).json()).toEqual({ count: 1 })
  expect(await (await hit()).json()).toEqual({ count: 2 })
})

it('reset clears counters', async () => {
  for (let i = 0; i < 3; i++) await hit('a')
  expect((await hit('a')).status).toBe(429)
  __reset()
  expect(await (await hit('a')).json()).toEqual({ count: 1 })
})

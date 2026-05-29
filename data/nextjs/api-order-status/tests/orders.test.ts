import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/orders/route'

beforeEach(() => __reset())

const get = (id: number) => GET(new Request(`http://x/api/orders?id=${id}`))
const act = (id: number, action: unknown) =>
  POST(new Request(`http://x/api/orders?id=${id}`, { method: 'POST', body: JSON.stringify({ action }) }))

it('GET returns seeded order state', async () => {
  const res = await get(1)
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ id: 1, state: 'pending' })
})

it('GET unknown id returns 404', async () => {
  const res = await get(99)
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('advances through the full lifecycle', async () => {
  expect(await (await act(1, 'pay')).json()).toEqual({ id: 1, state: 'paid' })
  expect(await (await act(1, 'ship')).json()).toEqual({ id: 1, state: 'shipped' })
  expect(await (await act(1, 'deliver')).json()).toEqual({ id: 1, state: 'delivered' })
})

it('invalid transition from current state returns 409', async () => {
  const res = await act(1, 'ship') // pending can't ship
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'invalid transition' })
})

it('unknown action returns 409', async () => {
  const res = await act(1, 'cancel')
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'invalid transition' })
})

it('POST on unknown id returns 404', async () => {
  const res = await act(42, 'pay')
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('cannot re-pay an already paid order', async () => {
  await act(1, 'pay')
  const res = await act(1, 'pay')
  expect(res.status).toBe(409)
})

it('reset returns the order to pending', async () => {
  await act(1, 'pay')
  __reset()
  expect(await (await get(1)).json()).toEqual({ id: 1, state: 'pending' })
})

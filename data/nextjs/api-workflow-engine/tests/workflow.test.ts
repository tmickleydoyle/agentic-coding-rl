import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/workflow/route'

beforeEach(() => __reset())

const get = (id: number | string) => GET(new Request(`http://x/api/workflow?id=${id}`))
const act = (id: number | string, body: unknown) =>
  POST(new Request(`http://x/api/workflow?id=${id}`, { method: 'POST', body: JSON.stringify(body) }))

it('GET returns seeded state and empty history', async () => {
  const res = await get(1)
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ state: 'draft', history: [] })
})

it('GET unknown id is 404', async () => {
  const res = await get(99)
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('POST unknown id is 404', async () => {
  const res = await act(99, { action: 'submit' })
  expect(res.status).toBe(404)
})

it('addItem appends and stays draft, records history', async () => {
  const res = await act(1, { action: 'addItem', item: 'pen' })
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.state).toBe('draft')
  expect(body.items).toEqual(['pen'])
  expect(body.history).toEqual(['addItem:draft'])
})

it('full lifecycle draft->submitted->approved->fulfilled', async () => {
  await act(1, { action: 'addItem', item: 'pen' })
  expect((await (await act(1, { action: 'submit' })).json()).state).toBe('submitted')
  expect((await (await act(1, { action: 'approve' })).json()).state).toBe('approved')
  const f = await act(1, { action: 'fulfill' })
  const body = await f.json()
  expect(body.state).toBe('fulfilled')
  expect(body.history).toEqual([
    'addItem:draft',
    'submit:submitted',
    'approve:approved',
    'fulfill:fulfilled',
  ])
})

it('submit on empty order fails guard (409 guard failed)', async () => {
  const res = await act(1, { action: 'submit' })
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'guard failed' })
})

it('addItem with empty item fails guard', async () => {
  const res = await act(1, { action: 'addItem', item: '' })
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'guard failed' })
})

it('invalid action for current state is 409 invalid transition', async () => {
  // order 1 is draft; approve only valid from submitted
  const res = await act(1, { action: 'approve' })
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'invalid transition' })
})

it('unknown action is 409 invalid transition', async () => {
  const res = await act(2, { action: 'teleport' })
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'invalid transition' })
})

it('reject sends submitted order back to draft', async () => {
  const res = await act(2, { action: 'reject' })
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.state).toBe('draft')
  expect(body.history).toEqual(['reject:draft'])
})

it('fulfilled is terminal: no further actions', async () => {
  await act(2, { action: 'approve' })
  await act(2, { action: 'fulfill' })
  const res = await act(2, { action: 'fulfill' })
  expect(res.status).toBe(409)
  expect(await res.json()).toEqual({ error: 'invalid transition' })
})

it('entities are independent', async () => {
  await act(1, { action: 'addItem', item: 'x' })
  const o2 = await get(2)
  expect((await o2.json()).state).toBe('submitted')
})

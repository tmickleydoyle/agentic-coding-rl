import { it, expect, beforeEach } from 'vitest'
import { POST, __reset } from '../app/api/bulk/route'

beforeEach(() => __reset())

const post = (body: unknown) =>
  POST(new Request('http://x/api/bulk', { method: 'POST', body: JSON.stringify(body) }))

it('applies a valid mixed batch atomically', async () => {
  const res = await post({
    ops: [
      { op: 'create', id: 3, value: 30 },
      { op: 'update', id: 1, value: 11 },
      { op: 'delete', id: 2 },
    ],
  })
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.applied).toBe(3)
  expect(body.state).toEqual({
    '1': { id: 1, value: 11 },
    '3': { id: 3, value: 30 },
  })
})

it('rejects the whole batch if any op is invalid (none applied)', async () => {
  const res = await post({
    ops: [
      { op: 'update', id: 1, value: 99 },
      { op: 'delete', id: 999 },
    ],
  })
  expect(res.status).toBe(422)
  const body = await res.json()
  expect(body.errors).toEqual([{ index: 1, message: 'not found' }])
  // confirm nothing was applied
  const after = await post({ ops: [{ op: 'update', id: 1, value: 1 }] })
  const state = (await after.json()).state
  expect(state['1']).toEqual({ id: 1, value: 1 })
})

it('reports every invalid op in order', async () => {
  const res = await post({
    ops: [
      { op: 'frobnicate', id: 1 },
      { op: 'create', id: 1, value: 5 },
      { op: 'update', id: 7, value: 5 },
    ],
  })
  expect(res.status).toBe(422)
  const body = await res.json()
  expect(body.errors).toEqual([
    { index: 0, message: 'unknown op' },
    { index: 1, message: 'exists' },
    { index: 2, message: 'not found' },
  ])
})

it('batch-aware: create then update same id is valid', async () => {
  const res = await post({
    ops: [
      { op: 'create', id: 9, value: 1 },
      { op: 'update', id: 9, value: 2 },
    ],
  })
  expect(res.status).toBe(200)
  expect((await res.json()).state['9']).toEqual({ id: 9, value: 2 })
})

it('batch-aware: create then create same id conflicts', async () => {
  const res = await post({
    ops: [
      { op: 'create', id: 9, value: 1 },
      { op: 'create', id: 9, value: 2 },
    ],
  })
  expect(res.status).toBe(422)
  expect((await res.json()).errors).toEqual([{ index: 1, message: 'exists' }])
})

it('batch-aware: delete then update same id is not found', async () => {
  const res = await post({
    ops: [
      { op: 'delete', id: 1 },
      { op: 'update', id: 1, value: 2 },
    ],
  })
  expect(res.status).toBe(422)
  expect((await res.json()).errors).toEqual([{ index: 1, message: 'not found' }])
})

it('non-number id is invalid id', async () => {
  const res = await post({ ops: [{ op: 'update', id: 'x', value: 1 }] })
  expect(res.status).toBe(422)
  expect((await res.json()).errors).toEqual([{ index: 0, message: 'invalid id' }])
})

it('non-number value is invalid value', async () => {
  const res = await post({ ops: [{ op: 'create', id: 5, value: 'nope' }] })
  expect(res.status).toBe(422)
  expect((await res.json()).errors).toEqual([{ index: 0, message: 'invalid value' }])
})

it('empty ops array is 400', async () => {
  const res = await post({ ops: [] })
  expect(res.status).toBe(400)
})

it('missing ops is 400', async () => {
  const res = await post({ foo: 1 })
  expect(res.status).toBe(400)
})

import { it, expect } from 'vitest'
import { POST } from '../app/api/calc/route'

const post = (body: unknown) =>
  POST(new Request('http://x/api/calc', { method: 'POST', body: JSON.stringify(body) }))

it('adds', async () => {
  const res = await post({ op: 'add', a: 2, b: 3 })
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ result: 5 })
})

it('subtracts and multiplies', async () => {
  expect(await (await post({ op: 'sub', a: 10, b: 4 })).json()).toEqual({ result: 6 })
  expect(await (await post({ op: 'mul', a: 6, b: 7 })).json()).toEqual({ result: 42 })
})

it('divides', async () => {
  expect(await (await post({ op: 'div', a: 9, b: 3 })).json()).toEqual({ result: 3 })
})

it('division by zero returns 400', async () => {
  const res = await post({ op: 'div', a: 1, b: 0 })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'division by zero' })
})

it('unknown op returns 400', async () => {
  const res = await post({ op: 'pow', a: 2, b: 3 })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'unknown op' })
})

it('non-number operand returns 400', async () => {
  const res = await post({ op: 'add', a: '2', b: 3 })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid operands' })
})

it('missing operand returns 400 before op check', async () => {
  const res = await post({ op: 'bogus', a: 1 })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid operands' })
})

import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/todos/route'

beforeEach(() => __reset())

const create = (text: unknown) =>
  POST(new Request('http://x/api/todos', { method: 'POST', body: JSON.stringify({ text }) }))

it('GET starts empty', async () => {
  const res = await GET(new Request('http://x/api/todos'))
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ todos: [] })
})

it('POST creates an auto-incrementing todo', async () => {
  const r1 = await create('first')
  expect(r1.status).toBe(201)
  expect(await r1.json()).toEqual({ id: 1, text: 'first', done: false })
  const r2 = await create('second')
  expect(await r2.json()).toEqual({ id: 2, text: 'second', done: false })
})

it('POST without text returns 400', async () => {
  const res = await create(undefined)
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'text required' })
})

it('GET lists created todos', async () => {
  await create('a')
  await create('b')
  const res = await GET(new Request('http://x/api/todos'))
  const body = await res.json()
  expect(body.todos.map((t: { text: string }) => t.text)).toEqual(['a', 'b'])
})

it('PUT toggles done', async () => {
  await create('a')
  const res = await PUT(
    new Request('http://x/api/todos?id=1', { method: 'PUT', body: JSON.stringify({ done: true }) }),
  )
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ id: 1, text: 'a', done: true })
})

it('PUT on missing id returns 404', async () => {
  const res = await PUT(
    new Request('http://x/api/todos?id=99', { method: 'PUT', body: JSON.stringify({ done: true }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a todo', async () => {
  await create('a')
  const del = await DELETE(new Request('http://x/api/todos?id=1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(new Request('http://x/api/todos'))
  expect(await res.json()).toEqual({ todos: [] })
})

it('DELETE on missing id returns 404', async () => {
  const res = await DELETE(new Request('http://x/api/todos?id=5', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

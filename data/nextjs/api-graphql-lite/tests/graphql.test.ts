import { it, expect, beforeEach } from 'vitest'
import { POST, __reset } from '../app/api/graphql/route'

beforeEach(() => __reset())

const q = (query: unknown) =>
  POST(new Request('http://x/api/graphql', { method: 'POST', body: JSON.stringify({ query }) }))

it('resolves scalar fields', async () => {
  const res = await q('user(id:1){ name }')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ data: { user: { name: 'Ada' } } })
})

it('resolves nested posts selection', async () => {
  const res = await q('user(id:1){ name posts{ title } }')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({
    data: { user: { name: 'Ada', posts: [{ title: 'Engines' }, { title: 'Notes' }] } },
  })
})

it('respects requested field order', async () => {
  const res = await q('user(id:2){ posts{ id title } name id }')
  const body = await res.json()
  expect(Object.keys(body.data.user)).toEqual(['posts', 'name', 'id'])
  expect(Object.keys(body.data.user.posts[0])).toEqual(['id', 'title'])
})

it('ignores arbitrary whitespace and newlines', async () => {
  const res = await q('  user( id : 2 ) {\n  name \n posts { id }\n}  ')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({
    data: { user: { name: 'Lin', posts: [{ id: 20 }] } },
  })
})

it('missing entity returns data.user null', async () => {
  const res = await q('user(id:999){ name }')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ data: { user: null } })
})

it('unknown user field is 400', async () => {
  const res = await q('user(id:1){ email }')
  expect(res.status).toBe(400)
  const body = await res.json()
  expect(Array.isArray(body.errors)).toBe(true)
  expect(body.errors.length).toBeGreaterThan(0)
})

it('unknown post field is 400', async () => {
  const res = await q('user(id:1){ posts{ body } }')
  expect(res.status).toBe(400)
})

it('posts without a selection set is 400', async () => {
  const res = await q('user(id:1){ posts }')
  expect(res.status).toBe(400)
})

it('scalar field given a selection set is 400', async () => {
  const res = await q('user(id:1){ name{ x } }')
  expect(res.status).toBe(400)
})

it('not starting with user is a parse error 400', async () => {
  const res = await q('account(id:1){ name }')
  expect(res.status).toBe(400)
})

it('missing id arg is 400', async () => {
  const res = await q('user(){ name }')
  expect(res.status).toBe(400)
})

it('empty selection set is 400', async () => {
  const res = await q('user(id:1){ }')
  expect(res.status).toBe(400)
})

it('unbalanced braces is 400', async () => {
  const res = await q('user(id:1){ name ')
  expect(res.status).toBe(400)
})

it('non-string query is 400', async () => {
  const res = await q(42)
  expect(res.status).toBe(400)
})

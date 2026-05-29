import { it, expect } from 'vitest'
import { GET } from '../app/api/users/route'

const get = (qs = '') => GET(new Request(`http://x/api/users${qs}`))

it('returns all users with no filter', async () => {
  const res = await get()
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.count).toBe(5)
})

it('filters by role', async () => {
  const body = await (await get('?role=admin')).json()
  expect(body.users.map((u: { name: string }) => u.name)).toEqual(['Alice', 'Carol'])
  expect(body.count).toBe(2)
})

it('filters by minAge', async () => {
  const body = await (await get('?minAge=30')).json()
  expect(body.users.map((u: { name: string }) => u.name)).toEqual(['Alice', 'Carol', 'Eve'])
})

it('combines role and minAge', async () => {
  const body = await (await get('?role=admin&minAge=35')).json()
  expect(body.users.map((u: { name: string }) => u.name)).toEqual(['Carol'])
  expect(body.count).toBe(1)
})

it('unknown role yields empty result', async () => {
  const body = await (await get('?role=ghost')).json()
  expect(body.users).toEqual([])
  expect(body.count).toBe(0)
})

it('invalid minAge returns 400', async () => {
  const res = await get('?minAge=old')
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid minAge' })
})

it('negative minAge returns 400', async () => {
  const res = await get('?minAge=-5')
  expect(res.status).toBe(400)
})

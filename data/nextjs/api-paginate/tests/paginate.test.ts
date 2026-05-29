import { it, expect } from 'vitest'
import { GET } from '../app/api/paginate/route'

const get = (qs = '') => GET(new Request(`http://x/api/paginate${qs}`))

it('defaults to page 1 limit 10', async () => {
  const res = await get()
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body).toEqual({
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3,
  })
})

it('returns the requested middle page', async () => {
  const body = await (await get('?page=2&limit=10')).json()
  expect(body.items).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  expect(body.page).toBe(2)
})

it('last page may be partial', async () => {
  const body = await (await get('?page=3&limit=10')).json()
  expect(body.items).toEqual([21, 22, 23, 24, 25])
})

it('clamps page beyond the end to the last page', async () => {
  const body = await (await get('?page=99&limit=10')).json()
  expect(body.page).toBe(3)
  expect(body.items).toEqual([21, 22, 23, 24, 25])
})

it('respects a custom limit', async () => {
  const body = await (await get('?page=1&limit=5')).json()
  expect(body.items).toEqual([1, 2, 3, 4, 5])
  expect(body.totalPages).toBe(5)
})

it('non-numeric param returns 400', async () => {
  const res = await get('?page=abc')
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'invalid params' })
})

it('zero or negative param returns 400', async () => {
  expect((await get('?limit=0')).status).toBe(400)
  expect((await get('?page=-2')).status).toBe(400)
})

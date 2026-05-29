import { it, expect } from 'vitest'
import { GET } from '../app/api/search/route'

const get = (qs = '') => GET(new Request(`http://x/api/search${qs}`))

it('missing q returns all items', async () => {
  const res = await get()
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.count).toBe(5)
  expect(body.results).toHaveLength(5)
})

it('empty q returns all items', async () => {
  const body = await (await get('?q=')).json()
  expect(body.count).toBe(5)
})

it('case-insensitive substring match', async () => {
  const body = await (await get('?q=ap')).json()
  expect(body.results.map((r: { name: string }) => r.name)).toEqual(['Apple', 'apricot', 'Grape'])
  expect(body.count).toBe(3)
})

it('matches across case', async () => {
  const body = await (await get('?q=BANANA')).json()
  expect(body.results).toEqual([{ id: 2, name: 'Banana' }])
})

it('no match returns empty with count 0', async () => {
  const body = await (await get('?q=zzz')).json()
  expect(body.results).toEqual([])
  expect(body.count).toBe(0)
})

it('returns json content-type', async () => {
  const res = await get('?q=a')
  expect(res.headers.get('content-type')).toBe('application/json')
})

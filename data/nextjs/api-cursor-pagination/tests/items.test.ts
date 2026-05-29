import { it, expect, beforeEach } from 'vitest'
import { GET, __reset } from '../app/api/items/route'

beforeEach(() => __reset())

const get = (qs = '') => GET(new Request(`http://x/api/items${qs}`))

it('first page uses default limit of 2', async () => {
  const res = await get()
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body.items.map((i: { id: number }) => i.id)).toEqual([1, 2])
  expect(body.hasMore).toBe(true)
  expect(body.nextCursor).toBe(btoa('2'))
})

it('cursor returns items strictly after the given id', async () => {
  const res = await get(`?cursor=${btoa('2')}`)
  const body = await res.json()
  expect(body.items.map((i: { id: number }) => i.id)).toEqual([3, 4])
  expect(body.nextCursor).toBe(btoa('4'))
})

it('walking cursors paginates the whole dataset in order', async () => {
  const seen: number[] = []
  let cursor: string | null = null
  for (let i = 0; i < 10; i++) {
    const qs: string = cursor ? `?cursor=${cursor}` : ''
    const body = await (await get(qs)).json()
    for (const it of body.items) seen.push(it.id)
    cursor = body.nextCursor
    if (!cursor) break
  }
  expect(seen).toEqual([1, 2, 3, 4, 5, 6, 7])
})

it('custom limit honored', async () => {
  const body = await (await get('?limit=3')).json()
  expect(body.items.map((i: { id: number }) => i.id)).toEqual([1, 2, 3])
})

it('limit larger than dataset returns all with hasMore false and null cursor', async () => {
  const body = await (await get('?limit=100')).json()
  expect(body.items.length).toBe(7)
  expect(body.hasMore).toBe(false)
  expect(body.nextCursor).toBeNull()
})

it('last page has hasMore false and null nextCursor', async () => {
  const body = await (await get(`?cursor=${btoa('6')}`)).json()
  expect(body.items.map((i: { id: number }) => i.id)).toEqual([7])
  expect(body.hasMore).toBe(false)
  expect(body.nextCursor).toBeNull()
})

it('cursor past the end returns empty page', async () => {
  const body = await (await get(`?cursor=${btoa('7')}`)).json()
  expect(body.items).toEqual([])
  expect(body.hasMore).toBe(false)
  expect(body.nextCursor).toBeNull()
})

it('non-integer limit is 400', async () => {
  const res = await get('?limit=abc')
  expect(res.status).toBe(400)
})

it('out-of-range limit is 400', async () => {
  expect((await get('?limit=0')).status).toBe(400)
  expect((await get('?limit=101')).status).toBe(400)
})

it('cursor that does not decode to an integer is 400', async () => {
  const res = await get(`?cursor=${btoa('notanumber')}`)
  expect(res.status).toBe(400)
})

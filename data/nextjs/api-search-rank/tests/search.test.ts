import { it, expect, beforeEach } from 'vitest'
import { GET, __reset } from '../app/api/search/route'

beforeEach(() => __reset())

const get = (qs: string) => GET(new Request(`http://x/api/search${qs}`))

it('missing q is 400', async () => {
  const res = await get('')
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'q required' })
})

it('blank q is 400', async () => {
  const res = await get('?q=%20%20')
  expect(res.status).toBe(400)
})

it('title matches weighted above body matches', async () => {
  // 'banana': doc1 title x1 (3), doc2 title x1 (3) + body x2 (2) = 5, doc1 body 0
  const body = await (await get('?q=banana')).json()
  expect(body.results).toEqual([
    { id: 2, score: 5 },
    { id: 1, score: 3 },
  ])
  expect(body.total).toBe(2)
})

it('only matching docs returned (score > 0)', async () => {
  const body = await (await get('?q=cherry')).json()
  expect(body.results).toEqual([{ id: 3, score: 4 }]) // title 3 + body 1
  expect(body.total).toBe(1)
})

it('multi-term scores sum across terms', async () => {
  // 'apple cherry':
  // doc1: apple title1(3)+body1(1)=4
  // doc3: apple body1(1) + cherry title1(3)+body1(1)=5
  const body = await (await get('?q=apple%20cherry')).json()
  expect(body.results).toEqual([
    { id: 3, score: 5 },
    { id: 1, score: 4 },
  ])
})

it('case-insensitive matching', async () => {
  const body = await (await get('?q=BANANA')).json()
  expect(body.results.map((r: { id: number }) => r.id)).toEqual([2, 1])
})

it('ties broken by id ascending', async () => {
  // 'apple' alone: doc1 title3+body1=4, doc3 body1=1 -> sorted [1,3]
  // construct a tie: 'split pie' -> doc2 title3, doc3 title3 -> tie, id asc
  const body = await (await get('?q=split%20pie')).json()
  expect(body.results).toEqual([
    { id: 2, score: 3 },
    { id: 3, score: 3 },
  ])
})

it('no matches returns empty with total 0', async () => {
  const body = await (await get('?q=zzz')).json()
  expect(body).toEqual({ results: [], total: 0, page: 1 })
})

it('pagination slices results and reports full total', async () => {
  const p1 = await (await get('?q=banana&limit=1&page=1')).json()
  expect(p1.results).toEqual([{ id: 2, score: 5 }])
  expect(p1.total).toBe(2)
  expect(p1.page).toBe(1)
  const p2 = await (await get('?q=banana&limit=1&page=2')).json()
  expect(p2.results).toEqual([{ id: 1, score: 3 }])
  expect(p2.total).toBe(2)
})

it('page beyond end returns empty results with correct total', async () => {
  const body = await (await get('?q=banana&limit=1&page=9')).json()
  expect(body.results).toEqual([])
  expect(body.total).toBe(2)
  expect(body.page).toBe(9)
})

it('bad page is 400', async () => {
  expect((await get('?q=banana&page=0')).status).toBe(400)
  expect((await get('?q=banana&page=x')).status).toBe(400)
})

it('bad limit is 400', async () => {
  expect((await get('?q=banana&limit=0')).status).toBe(400)
  expect((await get('?q=banana&limit=51')).status).toBe(400)
})

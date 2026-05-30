import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/goals/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded goals', async () => {
  const res = await GET(req('http://x/api/goals'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.goals.map((g: { id: string }) => g.id)).toEqual(['g1', 'g2'])
})

it('POST creates a goal with id g3 and one seeded milestone', async () => {
  const res = await POST(
    req('http://x/api/goals', {
      method: 'POST',
      body: JSON.stringify({ name: 'Learn guitar', targetDate: '2026-09-01' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('g3')
  expect(body.name).toBe('Learn guitar')
  expect(body.milestones).toEqual([{ id: 'g3-m1', title: 'Get started', done: false }])
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/goals', { method: 'POST', body: JSON.stringify({ targetDate: '2026-09-01' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST without a target date returns 400', async () => {
  const res = await POST(
    req('http://x/api/goals', { method: 'POST', body: JSON.stringify({ name: 'Learn guitar' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'targetDate required' })
})

it('PUT toggles a milestone on', async () => {
  const res = await PUT(
    req('http://x/api/goals', {
      method: 'PUT',
      body: JSON.stringify({ goalId: 'g1', milestoneId: 'g1-m3' }),
    }),
  )
  expect(res.status).toBe(200)
  const body = await res.json()
  const ms = body.milestones.find((m: { id: string }) => m.id === 'g1-m3')
  expect(ms.done).toBe(true)
})

it('PUT toggles a milestone off when already done', async () => {
  const res = await PUT(
    req('http://x/api/goals', {
      method: 'PUT',
      body: JSON.stringify({ goalId: 'g1', milestoneId: 'g1-m1' }),
    }),
  )
  const body = await res.json()
  const ms = body.milestones.find((m: { id: string }) => m.id === 'g1-m1')
  expect(ms.done).toBe(false)
})

it('PUT on a missing goal returns 404', async () => {
  const res = await PUT(
    req('http://x/api/goals', {
      method: 'PUT',
      body: JSON.stringify({ goalId: 'nope', milestoneId: 'x' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'goal not found' })
})

it('PUT on a missing milestone returns 404', async () => {
  const res = await PUT(
    req('http://x/api/goals', {
      method: 'PUT',
      body: JSON.stringify({ goalId: 'g1', milestoneId: 'nope' }),
    }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'milestone not found' })
})

it('DELETE removes a goal', async () => {
  const del = await DELETE(req('http://x/api/goals?id=g1', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const list = await (await GET(req('http://x/api/goals'))).json()
  expect(list.goals.map((g: { id: string }) => g.id)).toEqual(['g2'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/goals?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

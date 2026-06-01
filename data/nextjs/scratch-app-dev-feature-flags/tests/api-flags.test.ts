import { it, expect, beforeEach } from 'vitest'
import { GET, POST, PUT, DELETE, __reset } from '../app/api/flags/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded flags', async () => {
  const res = await GET(req('http://x/api/flags'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.flags.map((f: { id: string }) => f.id)).toEqual(['f1', 'f2', 'f3'])
})

it('GET ?env= returns only flags enabled in that env', async () => {
  const res = await GET(req('http://x/api/flags?env=stage'))
  const body = await res.json()
  expect(body.flags.map((f: { id: string }) => f.id)).toEqual(['f1'])
})

it('POST creates a flag with all envs off and rollout 0', async () => {
  const res = await POST(
    req('http://x/api/flags', { method: 'POST', body: JSON.stringify({ key: 'new-flag' }) }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.id).toBe('f4')
  expect(body.key).toBe('new-flag')
  expect(body.envs).toEqual({ dev: false, stage: false, prod: false })
  expect(body.rollout).toBe(0)
})

it('POST without a key returns 400', async () => {
  const res = await POST(req('http://x/api/flags', { method: 'POST', body: JSON.stringify({}) }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'key required' })
})

it('PUT sets an env enabled state explicitly', async () => {
  const res = await PUT(
    req('http://x/api/flags?id=f1', { method: 'PUT', body: JSON.stringify({ env: 'prod', enabled: true }) }),
  )
  const body = await res.json()
  expect(body.envs.prod).toBe(true)
})

it('PUT toggles an env when no enabled value is given', async () => {
  const res = await PUT(
    req('http://x/api/flags?id=f1', { method: 'PUT', body: JSON.stringify({ env: 'dev' }) }),
  )
  const body = await res.json()
  expect(body.envs.dev).toBe(false) // started true, toggled off
})

it('PUT clamps rollout to 0..100', async () => {
  const res = await PUT(
    req('http://x/api/flags?id=f2', { method: 'PUT', body: JSON.stringify({ rollout: 250 }) }),
  )
  const body = await res.json()
  expect(body.rollout).toBe(100)
})

it('PUT on a missing id returns 404', async () => {
  const res = await PUT(
    req('http://x/api/flags?id=nope', { method: 'PUT', body: JSON.stringify({ rollout: 10 }) }),
  )
  expect(res.status).toBe(404)
  expect(await res.json()).toEqual({ error: 'not found' })
})

it('DELETE removes a flag', async () => {
  const del = await DELETE(req('http://x/api/flags?id=f2', { method: 'DELETE' }))
  expect(del.status).toBe(200)
  expect(await del.json()).toEqual({ ok: true })
  const res = await GET(req('http://x/api/flags'))
  const body = await res.json()
  expect(body.flags.map((f: { id: string }) => f.id)).toEqual(['f1', 'f3'])
})

it('DELETE on a missing id returns 404', async () => {
  const res = await DELETE(req('http://x/api/flags?id=nope', { method: 'DELETE' }))
  expect(res.status).toBe(404)
})

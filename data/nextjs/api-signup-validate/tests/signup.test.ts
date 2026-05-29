import { it, expect } from 'vitest'
import { POST } from '../app/api/signup/route'

const post = (body: unknown) =>
  POST(new Request('http://x/api/signup', { method: 'POST', body: JSON.stringify(body) }))

it('accepts a valid signup', async () => {
  const res = await post({ email: 'a@b.com', password: 'longenough' })
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ ok: true })
})

it('rejects email without @ and .', async () => {
  const res = await post({ email: 'nope', password: 'longenough' })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ errors: { email: 'invalid email' } })
})

it('rejects short password', async () => {
  const res = await post({ email: 'a@b.com', password: 'short' })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ errors: { password: 'password too short' } })
})

it('reports both failing fields', async () => {
  const res = await post({ email: 'x', password: '1' })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({
    errors: { email: 'invalid email', password: 'password too short' },
  })
})

it('missing fields fail their rules', async () => {
  const res = await post({})
  expect(res.status).toBe(400)
  const body = await res.json()
  expect(body.errors.email).toBe('invalid email')
  expect(body.errors.password).toBe('password too short')
})

it('password of exactly 8 chars is valid', async () => {
  const res = await post({ email: 'a@b.io', password: '12345678' })
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ ok: true })
})

it('invalid JSON returns 400 with both errors', async () => {
  const res = await POST(new Request('http://x/api/signup', { method: 'POST', body: '{bad' }))
  expect(res.status).toBe(400)
  const body = await res.json()
  expect(body.errors.email).toBe('invalid email')
  expect(body.errors.password).toBe('password too short')
})

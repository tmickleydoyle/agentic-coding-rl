import { it, expect } from 'vitest'
import { POST } from '../app/api/auth/route'

const post = (body: unknown) =>
  POST(new Request('http://x/api/auth', { method: 'POST', body: JSON.stringify(body) }))

it('issues a deterministic token for valid creds', async () => {
  const res = await post({ username: 'admin', password: 'secret' })
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ token: 'token-admin' })
})

it('wrong password returns 401', async () => {
  const res = await post({ username: 'admin', password: 'nope' })
  expect(res.status).toBe(401)
  expect(await res.json()).toEqual({ error: 'invalid credentials' })
})

it('unknown username returns 401', async () => {
  const res = await post({ username: 'bob', password: 'secret' })
  expect(res.status).toBe(401)
  expect(await res.json()).toEqual({ error: 'invalid credentials' })
})

it('missing password returns 400', async () => {
  const res = await post({ username: 'admin' })
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'missing fields' })
})

it('empty username returns 400', async () => {
  const res = await post({ username: '', password: 'secret' })
  expect(res.status).toBe(400)
})

it('invalid JSON returns 400', async () => {
  const res = await POST(new Request('http://x/api/auth', { method: 'POST', body: '{bad' }))
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'missing fields' })
})

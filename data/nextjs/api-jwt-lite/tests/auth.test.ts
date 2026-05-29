import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset, __setNow } from '../app/api/auth/route'

beforeEach(() => __reset())

const login = (body: unknown) =>
  POST(new Request('http://x/api/auth', { method: 'POST', body: JSON.stringify(body) }))

const verify = (token: string | null) =>
  GET(
    new Request('http://x/api/auth', {
      headers: token === null ? {} : { authorization: `Bearer ${token}` },
    }),
  )

async function issue(user: string): Promise<string> {
  const res = await login({ user })
  return (await res.json()).token
}

it('POST issues a three-part token', async () => {
  __setNow(1000)
  const token = await issue('alice')
  expect(token.split('.').length).toBe(3)
})

it('round-trip: issued token verifies to the same user', async () => {
  __setNow(1000)
  const token = await issue('bob')
  const res = await verify(token)
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ user: 'bob' })
})

it('POST without user is 400', async () => {
  const res = await login({})
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'user required' })
})

it('POST with empty user is 400', async () => {
  const res = await login({ user: '' })
  expect(res.status).toBe(400)
})

it('GET without Authorization header is 401 missing token', async () => {
  const res = await verify(null)
  expect(res.status).toBe(401)
  expect(await res.json()).toEqual({ error: 'missing token' })
})

it('non-Bearer scheme is 401 missing token', async () => {
  const res = await GET(
    new Request('http://x/api/auth', { headers: { authorization: 'Basic abc' } }),
  )
  expect(res.status).toBe(401)
  expect(await res.json()).toEqual({ error: 'missing token' })
})

it('tampered payload (sig mismatch) is 401 invalid token', async () => {
  __setNow(1000)
  const token = await issue('carol')
  const [h, , s] = token.split('.')
  const forgedPayload = btoa(JSON.stringify({ user: 'admin', exp: 999999999 }))
  const res = await verify(`${h}.${forgedPayload}.${s}`)
  expect(res.status).toBe(401)
  expect(await res.json()).toEqual({ error: 'invalid token' })
})

it('malformed token (wrong part count) is 401 invalid token', async () => {
  const res = await verify('only.two')
  expect(res.status).toBe(401)
  expect(await res.json()).toEqual({ error: 'invalid token' })
})

it('expired token is 401 expired', async () => {
  __setNow(1000)
  const token = await issue('dave')
  __setNow(1000 + 60000) // exp is now()+60000 at issue; equal -> expired
  const res = await verify(token)
  expect(res.status).toBe(401)
  expect(await res.json()).toEqual({ error: 'expired' })
})

it('token valid just before expiry', async () => {
  __setNow(1000)
  const token = await issue('erin')
  __setNow(1000 + 59999)
  const res = await verify(token)
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ user: 'erin' })
})

import { describe, it, expect } from 'vitest'
import { POST } from '../reference/app/api/base64-encode/route'

const makeRequest = (body: unknown) =>
  new Request('http://x/api/base64-encode', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('POST /api/base64-encode', () => {
  it('encodes a string to base64', async () => {
    const res = await POST(makeRequest({ text: 'hello', mode: 'encode' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'aGVsbG8=' })
  })

  it('decodes a base64 string', async () => {
    const res = await POST(makeRequest({ text: 'aGVsbG8=', mode: 'decode' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: 'hello' })
  })

  it('returns 400 when text is missing', async () => {
    const res = await POST(makeRequest({ mode: 'encode' }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'text is required' })
  })

  it('returns 400 when mode is invalid', async () => {
    const res = await POST(makeRequest({ text: 'hello', mode: 'zip' }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'mode must be encode or decode' })
  })

  it('returns 400 when decode input is invalid base64', async () => {
    const res = await POST(makeRequest({ text: '!!!invalid!!!', mode: 'decode' }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'invalid base64 input' })
  })

  it('encodes a longer string', async () => {
    const res = await POST(makeRequest({ text: 'TypeScript', mode: 'encode' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ result: btoa('TypeScript') })
  })

  it('returns content-type application/json', async () => {
    const res = await POST(makeRequest({ text: 'a', mode: 'encode' }))
    expect(res.headers.get('content-type')).toBe('application/json')
  })
})

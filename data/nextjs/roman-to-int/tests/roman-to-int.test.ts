import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/roman-to-int/route'

describe('roman-to-int GET', () => {
  it('converts III to 3', async () => {
    const res = await GET(new Request('http://x/api/roman-to-int?roman=III'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ roman: 'III', value: 3 })
  })

  it('converts IV to 4', async () => {
    const res = await GET(new Request('http://x/api/roman-to-int?roman=IV'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ roman: 'IV', value: 4 })
  })

  it('converts XIV to 14', async () => {
    const res = await GET(new Request('http://x/api/roman-to-int?roman=XIV'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ roman: 'XIV', value: 14 })
  })

  it('converts MCMXCIX to 1999', async () => {
    const res = await GET(new Request('http://x/api/roman-to-int?roman=MCMXCIX'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ roman: 'MCMXCIX', value: 1999 })
  })

  it('returns 400 when roman param is missing', async () => {
    const res = await GET(new Request('http://x/api/roman-to-int'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'roman query parameter is required' })
  })

  it('returns 422 for invalid characters', async () => {
    const res = await GET(new Request('http://x/api/roman-to-int?roman=ABC'))
    expect(res.status).toBe(422)
    expect(await res.json()).toEqual({ error: 'invalid Roman numeral' })
  })

  it('converts XLII to 42', async () => {
    const res = await GET(new Request('http://x/api/roman-to-int?roman=XLII'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ roman: 'XLII', value: 42 })
  })
})

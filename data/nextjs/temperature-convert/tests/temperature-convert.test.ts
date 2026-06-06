import { describe, it, expect } from 'vitest'
import { GET } from '../reference/app/api/temperature-convert/route'

describe('temperature-convert GET', () => {
  it('converts 0 celsius to 32 fahrenheit', async () => {
    const res = await GET(new Request('http://x/api/temperature-convert?value=0&from=celsius&to=fahrenheit'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ value: 0, from: 'celsius', to: 'fahrenheit', result: 32 })
  })

  it('converts 100 celsius to 373.15 kelvin', async () => {
    const res = await GET(new Request('http://x/api/temperature-convert?value=100&from=celsius&to=kelvin'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ value: 100, from: 'celsius', to: 'kelvin', result: 373.15 })
  })

  it('converts 32 fahrenheit to 0 celsius', async () => {
    const res = await GET(new Request('http://x/api/temperature-convert?value=32&from=fahrenheit&to=celsius'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.result).toBe(0)
  })

  it('returns same value when from equals to', async () => {
    const res = await GET(new Request('http://x/api/temperature-convert?value=25&from=celsius&to=celsius'))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ value: 25, from: 'celsius', to: 'celsius', result: 25 })
  })

  it('returns 400 when params are missing', async () => {
    const res = await GET(new Request('http://x/api/temperature-convert?value=0&from=celsius'))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'value, from, and to query parameters are required' })
  })

  it('returns 422 for invalid unit', async () => {
    const res = await GET(new Request('http://x/api/temperature-convert?value=0&from=celsius&to=rankine'))
    expect(res.status).toBe(422)
    expect(await res.json()).toEqual({ error: 'from and to must be celsius, fahrenheit, or kelvin' })
  })

  it('returns 422 for non-numeric value', async () => {
    const res = await GET(new Request('http://x/api/temperature-convert?value=hot&from=celsius&to=fahrenheit'))
    expect(res.status).toBe(422)
    expect(await res.json()).toEqual({ error: 'value must be a valid number' })
  })

  it('converts 273.15 kelvin to 0 celsius', async () => {
    const res = await GET(new Request('http://x/api/temperature-convert?value=273.15&from=kelvin&to=celsius'))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.result).toBe(0)
  })
})

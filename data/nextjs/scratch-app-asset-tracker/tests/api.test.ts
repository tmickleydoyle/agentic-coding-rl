import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET, POST } from '../reference/app/api/assets/route'

beforeEach(() => __reset())

describe('Asset Tracker API', () => {
  it('GET /api/assets returns 4 seed assets', async () => {
    const req = new Request('http://localhost/api/assets')
    const res = await GET(req)
    const data = await res.json()
    expect(data.assets.length).toBe(4)
  })

  it('POST /api/assets creates an asset', async () => {
    const req = new Request('http://localhost/api/assets', {
      method: 'POST',
      body: JSON.stringify({ name: 'Monitor', category: 'Electronics', purchasePrice: 600, purchaseYear: 2025, depreciationRate: 20 }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const a = await res.json()
    expect(a.name).toBe('Monitor')
  })

  it('POST /api/assets returns 400 for missing name', async () => {
    const req = new Request('http://localhost/api/assets', {
      method: 'POST',
      body: JSON.stringify({ category: 'Electronics', purchasePrice: 100 }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET after POST shows new asset', async () => {
    const postReq = new Request('http://localhost/api/assets', {
      method: 'POST',
      body: JSON.stringify({ name: 'Chair', category: 'Furniture', purchasePrice: 300, purchaseYear: 2024, depreciationRate: 10 }),
    })
    await POST(postReq)
    const getReq = new Request('http://localhost/api/assets')
    const res = await GET(getReq)
    const data = await res.json()
    expect(data.assets.length).toBe(5)
  })

  it('GET returns assets with correct fields', async () => {
    const req = new Request('http://localhost/api/assets')
    const res = await GET(req)
    const data = await res.json()
    const a1 = data.assets.find((a: { id: string }) => a.id === 'a1')
    expect(a1.purchasePrice).toBe(3000)
    expect(a1.depreciationRate).toBe(25)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET as hGET, POST as hPOST, DELETE as hDEL } from '../reference/app/api/holdings/route'
import { GET as tGET, POST as tPOST } from '../reference/app/api/transactions/route'

beforeEach(() => { __reset() })

function makeReq(body: unknown, method = 'POST') {
  return new Request('http://localhost/', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

describe('Holdings API', () => {
  it('GET returns 3 seed holdings', async () => {
    const res = await hGET()
    const data = await res.json()
    expect(data.length).toBe(3)
  })

  it('POST creates holding', async () => {
    const res = await hPOST(makeReq({ symbol: 'TSLA', name: 'Tesla', quantity: 3, purchasePrice: 200, currentPrice: 250 }))
    expect(res.status).toBe(201)
  })

  it('POST returns 400 on missing fields', async () => {
    const res = await hPOST(makeReq({ symbol: 'TSLA' }))
    expect(res.status).toBe(400)
  })

  it('DELETE removes holding', async () => {
    const res = await hDEL(makeReq({ id: 'h1' }, 'DELETE'))
    expect(res.status).toBe(200)
    const list = await (await hGET()).json()
    expect(list.length).toBe(2)
  })
})

describe('Transactions API', () => {
  it('GET returns 2 seed transactions', async () => {
    const res = await tGET()
    const data = await res.json()
    expect(data.length).toBe(2)
  })

  it('POST creates transaction', async () => {
    const res = await tPOST(makeReq({ symbol: 'GOOGL', type: 'buy', quantity: 1, price: 2950, date: '2024-03-01' }))
    expect(res.status).toBe(201)
  })

  it('POST returns 400 on missing fields', async () => {
    const res = await tPOST(makeReq({ symbol: 'GOOGL' }))
    expect(res.status).toBe(400)
  })
})

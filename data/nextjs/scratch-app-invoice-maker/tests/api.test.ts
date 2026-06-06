import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET, POST } from '../reference/app/api/invoices/route'

beforeEach(() => __reset())

describe('Invoice API', () => {
  it('GET /api/invoices returns 3 seed invoices', async () => {
    const req = new Request('http://localhost/api/invoices')
    const res = await GET(req)
    const data = await res.json()
    expect(data.invoices.length).toBe(3)
  })

  it('POST /api/invoices creates an invoice', async () => {
    const req = new Request('http://localhost/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ clientId: 'c1', status: 'draft', items: [], taxRate: 10 }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const inv = await res.json()
    expect(inv.clientId).toBe('c1')
  })

  it('POST /api/invoices returns 400 for missing clientId', async () => {
    const req = new Request('http://localhost/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ status: 'draft' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET /api/invoices/clients returns 2 seed clients', async () => {
    const req = new Request('http://localhost/api/invoices/clients')
    const res = await GET(req)
    const data = await res.json()
    expect(data.clients.length).toBe(2)
  })

  it('POST /api/invoices/clients creates a client', async () => {
    const req = new Request('http://localhost/api/invoices/clients', {
      method: 'POST',
      body: JSON.stringify({ name: 'New Corp', email: 'new@corp.com' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const c = await res.json()
    expect(c.name).toBe('New Corp')
  })

  it('GET after POST shows new invoice', async () => {
    const postReq = new Request('http://localhost/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ clientId: 'c2', status: 'sent', items: [], taxRate: 0 }),
    })
    await POST(postReq)
    const getReq = new Request('http://localhost/api/invoices')
    const res = await GET(getReq)
    const data = await res.json()
    expect(data.invoices.length).toBe(4)
  })
})

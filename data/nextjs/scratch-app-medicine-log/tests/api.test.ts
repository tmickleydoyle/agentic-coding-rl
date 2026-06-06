import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET as medGET, POST as medPOST, DELETE as medDEL } from '../reference/app/api/medicines/route'
import { GET as logGET, POST as logPOST } from '../reference/app/api/log/route'

beforeEach(() => { __reset() })

function makeReq(body: unknown, method = 'POST') {
  return new Request('http://localhost/', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('Medicines API', () => {
  it('GET returns 3 seed medicines', async () => {
    const res = await medGET()
    const data = await res.json()
    expect(data.length).toBe(3)
  })

  it('POST creates medicine', async () => {
    const res = await medPOST(makeReq({ name: 'Zinc', dosage: '50mg', frequency: 'daily' }))
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.name).toBe('Zinc')
  })

  it('POST returns 400 on missing fields', async () => {
    const res = await medPOST(makeReq({ name: 'Zinc' }))
    expect(res.status).toBe(400)
  })

  it('DELETE removes medicine', async () => {
    const res = await medDEL(makeReq({ id: 'm1' }, 'DELETE'))
    expect(res.status).toBe(200)
    const list = await (await medGET()).json()
    expect(list.length).toBe(2)
  })
})

describe('Log API', () => {
  it('GET returns 2 seed entries', async () => {
    const res = await logGET()
    const data = await res.json()
    expect(data.length).toBe(2)
  })

  it('POST creates log entry', async () => {
    const res = await logPOST(makeReq({ medicineId: 'm1', datetime: '2024-06-11T09:00' }))
    expect(res.status).toBe(201)
  })

  it('POST returns 400 on missing datetime', async () => {
    const res = await logPOST(makeReq({ medicineId: 'm1' }))
    expect(res.status).toBe(400)
  })
})

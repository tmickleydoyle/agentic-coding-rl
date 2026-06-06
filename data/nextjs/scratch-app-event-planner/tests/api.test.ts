import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET as eGET, POST as ePOST, DELETE as eDEL } from '../reference/app/api/events/route'
import { GET as gGET, POST as gPOST, PATCH as gPATCH } from '../reference/app/api/guests/route'

beforeEach(() => { __reset() })

function makeReq(body: unknown, method = 'POST') {
  return new Request('http://localhost/', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

describe('Events API', () => {
  it('GET returns 2 seed events', async () => {
    const data = await (await eGET()).json()
    expect(data.length).toBe(2)
  })
  it('POST creates event', async () => {
    const res = await ePOST(makeReq({ title: 'Lunch', date: '2024-08-01', location: 'Cafe' }))
    expect(res.status).toBe(201)
  })
  it('POST returns 400 on missing fields', async () => {
    const res = await ePOST(makeReq({ title: 'Only title' }))
    expect(res.status).toBe(400)
  })
  it('DELETE removes event', async () => {
    await eDEL(makeReq({ id: 'e1' }, 'DELETE'))
    const data = await (await eGET()).json()
    expect(data.length).toBe(1)
  })
})

describe('Guests API', () => {
  it('GET returns 3 seed guests', async () => {
    const data = await (await gGET()).json()
    expect(data.length).toBe(3)
  })
  it('POST creates guest', async () => {
    const res = await gPOST(makeReq({ name: 'Dave', email: 'dave@example.com', eventId: 'e1' }))
    expect(res.status).toBe(201)
  })
  it('POST returns 400 on missing email', async () => {
    const res = await gPOST(makeReq({ name: 'Dave', eventId: 'e1' }))
    expect(res.status).toBe(400)
  })
  it('PATCH updates rsvp', async () => {
    const res = await gPATCH(makeReq({ id: 'g2', rsvp: 'confirmed' }, 'PATCH'))
    expect(res.status).toBe(200)
  })
})

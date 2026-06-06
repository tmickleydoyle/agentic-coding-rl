import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET as spGET, POST as spPOST, PATCH as spPATCH } from '../reference/app/api/sprints/route'
import { GET as tkGET, POST as tkPOST, PATCH as tkPATCH } from '../reference/app/api/tickets/route'
import { GET as tmGET, POST as tmPOST } from '../reference/app/api/team/route'

beforeEach(() => { __reset() })

function makeReq(body: unknown, method = 'POST') {
  return new Request('http://localhost/', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

describe('Sprints API', () => {
  it('GET returns 2 seed sprints', async () => {
    const data = await (await spGET()).json()
    expect(data.length).toBe(2)
  })
  it('POST creates sprint', async () => {
    const res = await spPOST(makeReq({ name: 'Sprint 3', startDate: '2024-07-01', endDate: '2024-07-14' }))
    expect(res.status).toBe(201)
  })
  it('POST returns 400 on missing fields', async () => {
    const res = await spPOST(makeReq({ name: 'Sprint 3' }))
    expect(res.status).toBe(400)
  })
  it('PATCH updates sprint status', async () => {
    const res = await spPATCH(makeReq({ id: 'sp2', status: 'active' }, 'PATCH'))
    expect(res.status).toBe(200)
  })
})

describe('Tickets API', () => {
  it('GET returns 3 seed tickets', async () => {
    const data = await (await tkGET()).json()
    expect(data.length).toBe(3)
  })
  it('POST creates ticket', async () => {
    const res = await tkPOST(makeReq({ title: 'New feature', sprintId: 'sp1', assigneeId: 't2' }))
    expect(res.status).toBe(201)
  })
  it('PATCH updates ticket status', async () => {
    const res = await tkPATCH(makeReq({ id: 'tk1', status: 'in-progress' }, 'PATCH'))
    expect(res.status).toBe(200)
  })
})

describe('Team API', () => {
  it('GET returns 3 seed members', async () => {
    const data = await (await tmGET()).json()
    expect(data.length).toBe(3)
  })
  it('POST creates team member', async () => {
    const res = await tmPOST(makeReq({ name: 'New Dev', role: 'Frontend', email: 'nd@team.com' }))
    expect(res.status).toBe(201)
  })
  it('POST returns 400 on missing email', async () => {
    const res = await tmPOST(makeReq({ name: 'New Dev', role: 'Frontend' }))
    expect(res.status).toBe(400)
  })
})

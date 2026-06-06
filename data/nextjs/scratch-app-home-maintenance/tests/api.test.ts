import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getTasks } from '../reference/lib/store'
import { GET as tGET, POST as tPOST, PATCH as tPATCH, DELETE as tDEL } from '../reference/app/api/tasks/route'
import { GET as hGET } from '../reference/app/api/history/route'

beforeEach(() => { __reset() })

function makeReq(body: unknown, method = 'POST') {
  return new Request('http://localhost/', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

describe('Tasks API', () => {
  it('GET returns 4 seed tasks', async () => {
    const res = await tGET()
    const data = await res.json()
    expect(data.length).toBe(4)
  })

  it('POST creates task', async () => {
    const res = await tPOST(makeReq({ title: 'New Task', room: 'Garage', dueDate: '2024-08-01' }))
    expect(res.status).toBe(201)
  })

  it('POST returns 400 on missing fields', async () => {
    const res = await tPOST(makeReq({ title: 'Only title' }))
    expect(res.status).toBe(400)
  })

  it('PATCH marks task complete', async () => {
    const res = await tPATCH(makeReq({ id: 't1' }, 'PATCH'))
    expect(res.status).toBe(200)
    const tasks = getTasks()
    expect(tasks.find(t => t.id === 't1')?.status).toBe('completed')
  })

  it('DELETE removes task', async () => {
    const res = await tDEL(makeReq({ id: 't1' }, 'DELETE'))
    expect(res.status).toBe(200)
    const tasks = getTasks()
    expect(tasks.find(t => t.id === 't1')).toBeUndefined()
  })
})

describe('History API', () => {
  it('GET returns completed tasks', async () => {
    const res = await hGET()
    const data = await res.json()
    expect(data.length).toBe(1)
    expect(data[0].status).toBe('completed')
  })
})

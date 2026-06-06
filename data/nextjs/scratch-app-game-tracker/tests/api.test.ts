import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET as gGET, POST as gPOST, DELETE as gDEL } from '../reference/app/api/games/route'
import { GET as sGET, POST as sPOST } from '../reference/app/api/sessions/route'
import { GET as aGET, POST as aPOST } from '../reference/app/api/achievements/route'

beforeEach(() => { __reset() })

function makeReq(body: unknown, method = 'POST') {
  return new Request('http://localhost/', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

describe('Games API', () => {
  it('GET returns 3 seed games', async () => {
    const data = await (await gGET()).json()
    expect(data.length).toBe(3)
  })
  it('POST creates game', async () => {
    const res = await gPOST(makeReq({ title: 'Cyberpunk', platform: 'PC', genre: 'RPG' }))
    expect(res.status).toBe(201)
  })
  it('POST returns 400 on missing fields', async () => {
    const res = await gPOST(makeReq({ title: 'Only title' }))
    expect(res.status).toBe(400)
  })
  it('DELETE removes game', async () => {
    await gDEL(makeReq({ id: 'g1' }, 'DELETE'))
    const data = await (await gGET()).json()
    expect(data.length).toBe(2)
  })
})

describe('Sessions API', () => {
  it('GET returns 2 seed sessions', async () => {
    const data = await (await sGET()).json()
    expect(data.length).toBe(2)
  })
  it('POST creates session', async () => {
    const res = await sPOST(makeReq({ gameId: 'g1', date: '2024-06-15', duration: 1.5 }))
    expect(res.status).toBe(201)
  })
  it('POST returns 400 on missing duration', async () => {
    const res = await sPOST(makeReq({ gameId: 'g1', date: '2024-06-15' }))
    expect(res.status).toBe(400)
  })
})

describe('Achievements API', () => {
  it('GET returns 2 seed achievements', async () => {
    const data = await (await aGET()).json()
    expect(data.length).toBe(2)
  })
  it('POST creates achievement', async () => {
    const res = await aPOST(makeReq({ gameId: 'g1', name: 'Explorer', description: 'Explore all regions', unlockedDate: '2024-06-10' }))
    expect(res.status).toBe(201)
  })
})

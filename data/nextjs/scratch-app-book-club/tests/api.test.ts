import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET as bGET, POST as bPOST, DELETE as bDEL } from '../reference/app/api/books/route'
import { GET as rGET, POST as rPOST } from '../reference/app/api/reviews/route'
import { GET as mGET, POST as mPOST } from '../reference/app/api/members/route'

beforeEach(() => { __reset() })

function makeReq(body: unknown, method = 'POST') {
  return new Request('http://localhost/', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

describe('Books API', () => {
  it('GET returns 3 seed books', async () => {
    const data = await (await bGET()).json()
    expect(data.length).toBe(3)
  })

  it('POST creates book', async () => {
    const res = await bPOST(makeReq({ title: '1984', author: 'Orwell', genre: 'Dystopia', year: 1949 }))
    expect(res.status).toBe(201)
  })

  it('POST returns 400 on missing fields', async () => {
    const res = await bPOST(makeReq({ title: 'Only title' }))
    expect(res.status).toBe(400)
  })

  it('DELETE removes book', async () => {
    await bDEL(makeReq({ id: 'b1' }, 'DELETE'))
    const data = await (await bGET()).json()
    expect(data.length).toBe(2)
  })
})

describe('Reviews API', () => {
  it('GET returns 2 seed reviews', async () => {
    const data = await (await rGET()).json()
    expect(data.length).toBe(2)
  })

  it('POST creates review', async () => {
    const res = await rPOST(makeReq({ bookId: 'b3', memberId: 'm1', rating: 4, text: 'Great habits book', date: '2024-05-01' }))
    expect(res.status).toBe(201)
  })

  it('POST returns 400 on missing text', async () => {
    const res = await rPOST(makeReq({ bookId: 'b1', memberId: 'm1', rating: 5, date: '2024-05-01' }))
    expect(res.status).toBe(400)
  })
})

describe('Members API', () => {
  it('GET returns 2 seed members', async () => {
    const data = await (await mGET()).json()
    expect(data.length).toBe(2)
  })

  it('POST creates member', async () => {
    const res = await mPOST(makeReq({ name: 'Neo', joinDate: '2024-05-01' }))
    expect(res.status).toBe(201)
  })

  it('POST returns 400 on missing joinDate', async () => {
    const res = await mPOST(makeReq({ name: 'Neo' }))
    expect(res.status).toBe(400)
  })
})

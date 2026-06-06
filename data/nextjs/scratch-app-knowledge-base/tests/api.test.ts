import { describe, it, expect, beforeEach } from 'vitest'
import { __reset } from '../reference/lib/store'
import { GET as aGET, POST as aPOST, DELETE as aDEL } from '../reference/app/api/articles/route'
import { GET as cGET, POST as cPOST, DELETE as cDEL } from '../reference/app/api/categories/route'

beforeEach(() => { __reset() })

function makeReq(body: unknown, method = 'POST') {
  return new Request('http://localhost/', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

describe('Articles API', () => {
  it('GET returns 3 seed articles', async () => {
    const data = await (await aGET()).json()
    expect(data.length).toBe(3)
  })
  it('POST creates article', async () => {
    const res = await aPOST(makeReq({ title: 'New', categoryId: 'c1', author: 'Me', content: 'Some content' }))
    expect(res.status).toBe(201)
  })
  it('POST returns 400 on missing fields', async () => {
    const res = await aPOST(makeReq({ title: 'New' }))
    expect(res.status).toBe(400)
  })
  it('DELETE removes article', async () => {
    await aDEL(makeReq({ id: 'a1' }, 'DELETE'))
    const data = await (await aGET()).json()
    expect(data.length).toBe(2)
  })
})

describe('Categories API', () => {
  it('GET returns 3 seed categories', async () => {
    const data = await (await cGET()).json()
    expect(data.length).toBe(3)
  })
  it('POST creates category', async () => {
    const res = await cPOST(makeReq({ name: 'Health', description: 'Health topics' }))
    expect(res.status).toBe(201)
  })
  it('POST returns 400 on missing name', async () => {
    const res = await cPOST(makeReq({ description: 'no name' }))
    expect(res.status).toBe(400)
  })
  it('DELETE removes category', async () => {
    await cDEL(makeReq({ id: 'c3' }, 'DELETE'))
    const data = await (await cGET()).json()
    expect(data.length).toBe(2)
  })
})

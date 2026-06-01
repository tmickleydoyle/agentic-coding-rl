import { it, expect, beforeEach } from 'vitest'
import { GET, __reset } from '../app/api/audit/route'
import { POST as createFlag, PUT as updateFlag } from '../app/api/flags/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET starts empty', async () => {
  const res = await GET(req('http://x/api/audit'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.audit).toEqual([])
})

it('records a create entry when a flag is created', async () => {
  await createFlag(req('http://x/api/flags', { method: 'POST', body: JSON.stringify({ key: 'x' }) }))
  const res = await GET(req('http://x/api/audit'))
  const body = await res.json()
  expect(body.audit.length).toBe(1)
  expect(body.audit[0].action).toBe('create')
})

it('records a toggle entry and returns newest first', async () => {
  await updateFlag(req('http://x/api/flags?id=f1', { method: 'PUT', body: JSON.stringify({ env: 'prod' }) }))
  await updateFlag(req('http://x/api/flags?id=f1', { method: 'PUT', body: JSON.stringify({ rollout: 10 }) }))
  const res = await GET(req('http://x/api/audit'))
  const body = await res.json()
  expect(body.audit.map((a: { action: string }) => a.action)).toEqual(['rollout', 'toggle'])
})

it('filters audit by flagId', async () => {
  await updateFlag(req('http://x/api/flags?id=f1', { method: 'PUT', body: JSON.stringify({ env: 'prod' }) }))
  await updateFlag(req('http://x/api/flags?id=f2', { method: 'PUT', body: JSON.stringify({ env: 'prod' }) }))
  const res = await GET(req('http://x/api/audit?flagId=f2'))
  const body = await res.json()
  expect(body.audit.length).toBe(1)
  expect(body.audit[0].flagId).toBe('f2')
})

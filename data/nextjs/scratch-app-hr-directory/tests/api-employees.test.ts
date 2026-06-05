import { it, expect, beforeEach } from 'vitest'
import { GET, POST, __reset } from '../app/api/employees/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET lists the seeded employees', async () => {
  const res = await GET(req('http://x/api/employees'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.employees.map((e: { id: string }) => e.id)).toEqual(['e1', 'e2', 'e3', 'e4', 'e5'])
})

it('GET filters by q (name/title substring)', async () => {
  const res = await GET(req('http://x/api/employees?q=hopper'))
  const body = await res.json()
  expect(body.employees.map((e: { id: string }) => e.id)).toEqual(['e3'])
})

it('GET filters by department', async () => {
  const res = await GET(req('http://x/api/employees?department=Sales'))
  const body = await res.json()
  expect(body.employees.map((e: { id: string }) => e.id)).toEqual(['e4', 'e5'])
})

it('POST creates an employee and returns 201', async () => {
  const res = await POST(
    req('http://x/api/employees', {
      method: 'POST',
      body: JSON.stringify({ name: 'Edith Clarke', title: 'Engineer', department: 'Engineering' }),
    }),
  )
  expect(res.status).toBe(201)
  const body = await res.json()
  expect(body.name).toBe('Edith Clarke')
  expect(body.department).toBe('Engineering')
  expect(body.id).toBe('e6')
})

it('POST defaults missing department to Unassigned', async () => {
  const res = await POST(
    req('http://x/api/employees', { method: 'POST', body: JSON.stringify({ name: 'Nobody', title: 'Intern' }) }),
  )
  const body = await res.json()
  expect(body.department).toBe('Unassigned')
})

it('POST without a name returns 400', async () => {
  const res = await POST(
    req('http://x/api/employees', { method: 'POST', body: JSON.stringify({ title: 'Engineer' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'name required' })
})

it('POST without a title returns 400', async () => {
  const res = await POST(
    req('http://x/api/employees', { method: 'POST', body: JSON.stringify({ name: 'Someone' }) }),
  )
  expect(res.status).toBe(400)
  expect(await res.json()).toEqual({ error: 'title required' })
})

it('a created employee then appears in GET', async () => {
  await POST(
    req('http://x/api/employees', { method: 'POST', body: JSON.stringify({ name: 'Hedy Lamarr', title: 'Inventor' }) }),
  )
  const res = await GET(req('http://x/api/employees'))
  const body = await res.json()
  expect(body.employees.map((e: { name: string }) => e.name)).toContain('Hedy Lamarr')
})

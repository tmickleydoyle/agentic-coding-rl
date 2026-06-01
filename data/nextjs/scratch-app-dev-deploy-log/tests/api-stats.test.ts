import { it, expect, beforeEach } from 'vitest'
import { GET, __reset } from '../app/api/stats/route'
import { POST as createDeploy, PUT as updateDeploy } from '../app/api/deployments/route'

beforeEach(() => __reset())

const req = (url: string, init?: RequestInit) => new Request(url, init)

it('GET reports total, byStatus, byEnv and successRate from seed', async () => {
  const res = await GET(req('http://x/api/stats'))
  expect(res.status).toBe(200)
  expect(res.headers.get('content-type')).toBe('application/json')
  const body = await res.json()
  expect(body.total).toBe(3)
  expect(body.byStatus.success).toBe(2)
  expect(body.byStatus.failed).toBe(1)
  expect(body.byEnv.prod).toBe(1)
  expect(body.successRate).toBeCloseTo(2 / 3, 5)
})

it('successRate updates after a rollback', async () => {
  await updateDeploy(req('http://x/api/deployments?id=d1', { method: 'PUT', body: JSON.stringify({}) }))
  const res = await GET(req('http://x/api/stats'))
  const body = await res.json()
  expect(body.byStatus.success).toBe(1)
  expect(body.byStatus.rolled_back).toBe(1)
  expect(body.successRate).toBeCloseTo(1 / 3, 5)
})

it('byEnv grows when a deployment is created in a new env', async () => {
  await createDeploy(
    req('http://x/api/deployments', { method: 'POST', body: JSON.stringify({ env: 'qa', service: 'web' }) }),
  )
  const res = await GET(req('http://x/api/stats'))
  const body = await res.json()
  expect(body.total).toBe(4)
  expect(body.byEnv.qa).toBe(1)
})

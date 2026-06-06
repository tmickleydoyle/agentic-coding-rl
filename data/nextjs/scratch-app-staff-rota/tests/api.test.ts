import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getStaff, addStaff, getShifts, addShift, getRequests, addRequest, updateRequestStatus } from '../lib/store'

beforeEach(() => { __reset() })

describe('Store API', () => {
  it('getStaff returns 5 seed members', () => {
    expect(getStaff().length).toBe(5)
  })

  it('addStaff increments list', () => {
    addStaff({ name: 'X', email: 'x@x.com', role: 'R', department: 'D' })
    expect(getStaff().length).toBe(6)
  })

  it('getShifts returns 6 seed shifts', () => {
    expect(getShifts().length).toBe(6)
  })

  it('addShift increments list', () => {
    addShift({ staffId: 'st1', date: '2024-06-20', startTime: '09:00', endTime: '17:00', role: 'Manager' })
    expect(getShifts().length).toBe(7)
  })

  it('getRequests returns 3 seed requests', () => {
    expect(getRequests().length).toBe(3)
  })

  it('addRequest sets status pending', () => {
    addRequest({ staffId: 'st1', startDate: '2024-07-10', endDate: '2024-07-12', reason: 'Vacation' })
    const reqs = getRequests()
    expect(reqs[reqs.length - 1].status).toBe('pending')
  })

  it('updateRequestStatus approves request', () => {
    updateRequestStatus('r1', 'approved')
    const req = getRequests().find(r => r.id === 'r1')
    expect(req?.status).toBe('approved')
  })

  it('updateRequestStatus denies request', () => {
    updateRequestStatus('r3', 'denied')
    const req = getRequests().find(r => r.id === 'r3')
    expect(req?.status).toBe('denied')
  })
})

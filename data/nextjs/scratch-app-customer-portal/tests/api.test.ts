import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getTickets, addTicket, closeTicket, getOrders, addOrder, getProfile, updateProfile } from '../lib/store'

beforeEach(() => { __reset() })

describe('Store API', () => {
  it('getTickets returns 4 seed tickets', () => {
    expect(getTickets().length).toBe(4)
  })

  it('addTicket sets status open', () => {
    addTicket({ subject: 'Test', priority: 'low' })
    const t = getTickets()
    expect(t[t.length - 1].status).toBe('open')
  })

  it('closeTicket sets status closed', () => {
    closeTicket('t1')
    expect(getTickets().find(t => t.id === 't1')?.status).toBe('closed')
  })

  it('getOrders returns 4 seed orders', () => {
    expect(getOrders().length).toBe(4)
  })

  it('addOrder sets status pending', () => {
    addOrder({ orderNumber: 'ORD-005', date: '2024-06-01', total: 50 })
    const os = getOrders()
    expect(os[os.length - 1].status).toBe('pending')
  })

  it('getProfile returns seed profile', () => {
    expect(getProfile().name).toBe('Alex Customer')
  })

  it('updateProfile persists changes', () => {
    updateProfile({ name: 'New Name', phone: '999-9999' })
    expect(getProfile().name).toBe('New Name')
    expect(getProfile().phone).toBe('999-9999')
  })

  it('__reset restores profile', () => {
    updateProfile({ name: 'Changed' })
    __reset()
    expect(getProfile().name).toBe('Alex Customer')
  })
})

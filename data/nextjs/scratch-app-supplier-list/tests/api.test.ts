import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getSuppliers, addSupplier, toggleSupplier, getContacts, addContact, getContracts, addContract } from '../lib/store'

beforeEach(() => { __reset() })

describe('Store API', () => {
  it('getSuppliers returns 5 seed suppliers', () => {
    expect(getSuppliers().length).toBe(5)
  })

  it('addSupplier sets status active', () => {
    addSupplier({ name: 'X', category: 'Y', country: 'Z' })
    const ss = getSuppliers()
    expect(ss[ss.length - 1].status).toBe('active')
  })

  it('toggleSupplier flips active to inactive', () => {
    toggleSupplier('sup1')
    expect(getSuppliers().find(s => s.id === 'sup1')?.status).toBe('inactive')
  })

  it('toggleSupplier flips inactive to active', () => {
    toggleSupplier('sup3')
    expect(getSuppliers().find(s => s.id === 'sup3')?.status).toBe('active')
  })

  it('getContacts returns 5 seed contacts', () => {
    expect(getContacts().length).toBe(5)
  })

  it('addContact increments list', () => {
    addContact({ name: 'X', email: 'x@x.com', phone: '555', supplierId: 'sup1', role: 'R' })
    expect(getContacts().length).toBe(6)
  })

  it('getContracts returns 4 seed contracts', () => {
    expect(getContracts().length).toBe(4)
  })

  it('addContract with future endDate sets status active', () => {
    addContract({ supplierId: 'sup1', startDate: '2024-01-01', endDate: '2099-12-31', value: 1000 })
    const cs = getContracts()
    expect(cs[cs.length - 1].status).toBe('active')
  })
})

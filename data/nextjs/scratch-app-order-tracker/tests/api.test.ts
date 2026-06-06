import { describe, it, expect, beforeEach } from 'vitest'
import { __reset, getOrders, addOrder, updateOrderStatus, getShipments, addShipment, getReturns, addReturn } from '../lib/store'

beforeEach(() => { __reset() })

describe('Store API', () => {
  it('getOrders returns 5 seed orders', () => {
    expect(getOrders().length).toBe(5)
  })

  it('addOrder sets status processing', () => {
    addOrder({ orderNumber: 'ORD-3001', customerName: 'Test', date: '2024-06-01', total: 50 })
    const os = getOrders()
    expect(os[os.length - 1].status).toBe('processing')
  })

  it('updateOrderStatus changes status', () => {
    updateOrderStatus('ord1', 'shipped')
    expect(getOrders().find(o => o.id === 'ord1')?.status).toBe('shipped')
  })

  it('getShipments returns 3 seed shipments', () => {
    expect(getShipments().length).toBe(3)
  })

  it('addShipment defaults to in_transit', () => {
    addShipment({ orderId: 'ord5', carrier: 'DHL', trackingNumber: 'DH001', estimatedDelivery: '2024-06-01' })
    const ss = getShipments()
    expect(ss[ss.length - 1].status).toBe('in_transit')
  })

  it('getReturns returns 2 seed returns', () => {
    expect(getReturns().length).toBe(2)
  })

  it('addReturn sets status open', () => {
    addReturn({ orderId: 'ord2', reason: 'Damaged' })
    const rs = getReturns()
    expect(rs[rs.length - 1].status).toBe('open')
  })

  it('__reset restores seed state', () => {
    addOrder({ orderNumber: 'X', customerName: 'X', date: '2024-01-01', total: 1 })
    __reset()
    expect(getOrders().length).toBe(5)
  })
})

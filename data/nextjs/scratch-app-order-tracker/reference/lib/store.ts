import { Order, Shipment, Return } from './types'

const seedOrders: Order[] = [
  { id: 'ord1', orderNumber: 'ORD-2001', customerName: 'Alice Green', date: '2024-04-10', total: 150.00, status: 'processing' },
  { id: 'ord2', orderNumber: 'ORD-2002', customerName: 'Bob White', date: '2024-04-12', total: 89.50, status: 'shipped' },
  { id: 'ord3', orderNumber: 'ORD-2003', customerName: 'Carol Black', date: '2024-04-15', total: 210.75, status: 'delivered' },
  { id: 'ord4', orderNumber: 'ORD-2004', customerName: 'Dave Gray', date: '2024-05-01', total: 45.00, status: 'shipped' },
  { id: 'ord5', orderNumber: 'ORD-2005', customerName: 'Eve Blue', date: '2024-05-05', total: 320.00, status: 'processing' },
]

const seedShipments: Shipment[] = [
  { id: 'sh1', orderId: 'ord2', carrier: 'FedEx', trackingNumber: 'FX123456', status: 'in_transit', estimatedDelivery: '2024-04-18' },
  { id: 'sh2', orderId: 'ord3', carrier: 'UPS', trackingNumber: 'UP789012', status: 'delivered', estimatedDelivery: '2024-04-20' },
  { id: 'sh3', orderId: 'ord4', carrier: 'USPS', trackingNumber: 'US345678', status: 'in_transit', estimatedDelivery: '2024-05-10' },
]

const seedReturns: Return[] = [
  { id: 'ret1', orderId: 'ord3', reason: 'Wrong size', status: 'open', createdAt: '2024-04-25' },
  { id: 'ret2', orderId: 'ord1', reason: 'Changed mind', status: 'processing', createdAt: '2024-04-11' },
]

let orders: Order[] = seedOrders.map(o => ({ ...o }))
let shipments: Shipment[] = seedShipments.map(s => ({ ...s }))
let returns: Return[] = seedReturns.map(r => ({ ...r }))
let nextId = 100

export function __reset() {
  orders = seedOrders.map(o => ({ ...o }))
  shipments = seedShipments.map(s => ({ ...s }))
  returns = seedReturns.map(r => ({ ...r }))
  nextId = 100
}

export function getOrders(): Order[] { return orders }
export function addOrder(data: Omit<Order, 'id' | 'status'>): Order {
  const o: Order = { ...data, id: `ord${nextId++}`, status: 'processing' }
  orders.push(o)
  return o
}
export function updateOrderStatus(id: string, status: Order['status']): Order | null {
  const o = orders.find(x => x.id === id)
  if (!o) return null
  o.status = status
  return o
}

export function getShipments(): Shipment[] { return shipments }
export function addShipment(data: Omit<Shipment, 'id' | 'status'>): Shipment {
  const s: Shipment = { ...data, id: `sh${nextId++}`, status: 'in_transit' }
  shipments.push(s)
  return s
}

export function getReturns(): Return[] { return returns }
export function addReturn(data: { orderId: string; reason: string }): Return {
  const r: Return = { ...data, id: `ret${nextId++}`, status: 'open', createdAt: new Date().toISOString().slice(0, 10) }
  returns.push(r)
  return r
}
export function updateReturnStatus(id: string, status: Return['status']): Return | null {
  const r = returns.find(x => x.id === id)
  if (!r) return null
  r.status = status
  return r
}

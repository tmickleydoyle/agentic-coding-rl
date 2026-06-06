import { Order, Shipment, Return } from './types'

export function __reset() {}
export function getOrders(): Order[] { return [] }
export function addOrder(_d: Omit<Order, 'id' | 'status'>): Order { return {} as Order }
export function updateOrderStatus(_id: string, _s: Order['status']): Order | null { return null }
export function getShipments(): Shipment[] { return [] }
export function addShipment(_d: Omit<Shipment, 'id' | 'status'>): Shipment { return {} as Shipment }
export function getReturns(): Return[] { return [] }
export function addReturn(_d: { orderId: string; reason: string }): Return { return {} as Return }
export function updateReturnStatus(_id: string, _s: Return['status']): Return | null { return null }

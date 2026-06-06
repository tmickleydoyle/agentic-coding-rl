export interface Order { id: string; orderNumber: string; customerName: string; date: string; total: number; status: 'processing' | 'shipped' | 'delivered' | 'cancelled' }
export interface Shipment { id: string; orderId: string; carrier: string; trackingNumber: string; status: 'in_transit' | 'delivered'; estimatedDelivery: string }
export interface Return { id: string; orderId: string; reason: string; status: 'open' | 'processing' | 'completed'; createdAt: string }
export type Route = 'home' | 'orders' | 'shipments' | 'returns'

export type OrderStatus = 'new' | 'packing' | 'shipped' | 'delivered'
export type Route = 'orders' | 'summary' | 'settings'
export type Order = { id: number; customer: string; status: OrderStatus }

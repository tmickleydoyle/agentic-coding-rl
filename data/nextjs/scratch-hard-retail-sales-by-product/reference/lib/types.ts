export type Route = 'products' | 'sales' | 'report'
export type Product = { id: number; name: string; price: number }
export type Sale = { id: number; productId: number; qty: number; price: number }

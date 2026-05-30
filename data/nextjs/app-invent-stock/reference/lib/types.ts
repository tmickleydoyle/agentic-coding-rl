export type Product = {
  id: string
  name: string
  qty: number
  reorderPoint: number
}

export type StockFilter = 'all' | 'low' | 'ok'

export type Route = 'products' | 'product-detail' | 'adjust' | 'low-stock'
export type Theme = 'light' | 'dark'

export function isLow(p: Product): boolean {
  return p.qty <= p.reorderPoint
}

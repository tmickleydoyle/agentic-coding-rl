export type Route = 'inventory' | 'summary' | 'settings'
export type Product = {
  id: number
  name: string
  price: number
  onHand: number
  reorderPoint: number
}

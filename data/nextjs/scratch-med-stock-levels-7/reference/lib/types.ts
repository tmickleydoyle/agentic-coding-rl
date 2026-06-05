export type Route = 'inventory' | 'summary' | 'settings'
export type Product = {
  id: number
  name: string
  unitPrice: number
  onHand: number
  reorderPoint: number
}

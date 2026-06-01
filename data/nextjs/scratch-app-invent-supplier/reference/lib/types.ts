export type Supplier = {
  id: string
  name: string
  category: string
  leadTimeDays: number
  rating: number
}

export type Product = {
  id: string
  name: string
  supplierId: string
  price: number
}

export type Route = 'suppliers' | 'supplier-detail' | 'products' | 'add'
export type Theme = 'light' | 'dark'

'use client'
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product, Sale, Route } from '../lib/types'

type Ctx = {
  products: Product[]
  sales: Sale[]
  route: Route
  navigate: (r: Route) => void
  addProduct: (name: string, price: string) => void
  recordSale: (productId: string, qty: string) => void
}

export const ShopContext = createContext<Ctx | null>(null)

export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [route, setRoute] = useState<Route>('products')
  const [nextProduct, setNextProduct] = useState(1)
  const [nextSale, setNextSale] = useState(1)

  function addProduct(name: string, price: string) {
    const n = name.trim()
    if (!n) return
    const p = parseFloat(price)
    const safe = isFinite(p) && p > 0 ? p : 0
    setProducts((ps) => [...ps, { id: nextProduct, name: n, price: safe }])
    setNextProduct((x) => x + 1)
  }

  function recordSale(productId: string, qty: string) {
    const pid = parseInt(productId, 10)
    const prod = products.find((p) => p.id === pid)
    if (!prod) return
    const q = Math.floor(parseFloat(qty))
    if (!isFinite(q) || q < 1) return
    setSales((ss) => [...ss, { id: nextSale, productId: pid, qty: q, price: prod.price }])
    setNextSale((x) => x + 1)
  }

  const value: Ctx = {
    products,
    sales,
    route,
    navigate: setRoute,
    addProduct,
    recordSale,
  }
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

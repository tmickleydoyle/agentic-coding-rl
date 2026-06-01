'use client'
import { useShop } from '../components/AppStateProvider'
import type { CartLine, CategoryFilter, Product } from '../lib/types'

export function isWishlisted(wishlist: string[], id: string): boolean {
  return wishlist.indexOf(id) !== -1
}

export function filterProducts(
  products: Product[],
  categoryFilter: CategoryFilter,
  maxPrice: number | null,
): Product[] {
  return products.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false
    if (maxPrice !== null && p.price > maxPrice) return false
    return true
  })
}

export function sumCart(cart: CartLine[]): number {
  return cart.reduce((sum, l) => sum + l.qty, 0)
}

export function useWishlist() {
  const { products, wishlist, cart, categoryFilter, maxPrice } = useShop()
  const wishlistProducts = products.filter((p) => wishlist.indexOf(p.id) !== -1)
  const wishlistCount = wishlist.length
  const cartCount = sumCart(cart)
  const visible = filterProducts(products, categoryFilter, maxPrice)
  return { wishlistProducts, wishlistCount, cartCount, visible }
}

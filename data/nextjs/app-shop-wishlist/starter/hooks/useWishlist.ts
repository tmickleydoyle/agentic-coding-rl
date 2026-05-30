'use client'
import { useShop } from '../components/AppStateProvider'
import type { Product } from '../lib/types'

export function useWishlist() {
  // TODO: derive wishlistProducts (products whose ids are wishlisted, in product order),
  // wishlistCount, cartCount (sum of cart qtys), and `visible` (products after filters).
  useShop()
  return {
    wishlistProducts: [] as Product[],
    wishlistCount: 0,
    cartCount: 0,
    visible: [] as Product[],
  }
}

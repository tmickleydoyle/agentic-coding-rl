'use client'
import { useMenu } from '../components/AppStateProvider'
import type { CartLine, Dish } from '../lib/types'

export function uniqueCategories(_dishes: Dish[]): string[] {
  // TODO: return the sorted unique category list
  return []
}

export function filterDishes(_dishes: Dish[], _categoryFilter: string, _vegOnly: boolean): Dish[] {
  // TODO: filter by category AND (when vegOnly) vegetarian
  return []
}

export function cartTotals(
  _dishes: Dish[],
  _cart: CartLine[],
): { cartCount: number; subtotal: number; tax: number; total: number } {
  // TODO: compute cartCount, subtotal, tax (10%), total
  return { cartCount: 0, subtotal: 0, tax: 0, total: 0 }
}

export function useMenuViews() {
  useMenu()
  // TODO: derive categories, filtered, cartCount, subtotal, tax, total from shared state
  return {
    categories: [] as string[],
    filtered: [] as Dish[],
    cartCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
  }
}

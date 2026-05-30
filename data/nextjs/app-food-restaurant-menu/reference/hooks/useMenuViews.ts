'use client'
import { useMenu } from '../components/AppStateProvider'
import { TAX_RATE, type CartLine, type Dish } from '../lib/types'

export function uniqueCategories(dishes: Dish[]): string[] {
  const set = new Set<string>()
  dishes.forEach((d) => set.add(d.category))
  return Array.from(set).sort()
}

export function filterDishes(dishes: Dish[], categoryFilter: string, vegOnly: boolean): Dish[] {
  return dishes.filter((d) => {
    if (categoryFilter !== 'all' && d.category !== categoryFilter) return false
    if (vegOnly && !d.vegetarian) return false
    return true
  })
}

export function cartTotals(
  dishes: Dish[],
  cart: CartLine[],
): { cartCount: number; subtotal: number; tax: number; total: number } {
  let cartCount = 0
  let subtotal = 0
  cart.forEach((line) => {
    cartCount += line.qty
    const dish = dishes.find((d) => d.id === line.dishId)
    if (dish) subtotal += dish.price * line.qty
  })
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100
  return { cartCount, subtotal, tax, total }
}

export function useMenuViews() {
  const { dishes, cart, categoryFilter, vegOnly } = useMenu()
  const categories = uniqueCategories(dishes)
  const filtered = filterDishes(dishes, categoryFilter, vegOnly)
  const { cartCount, subtotal, tax, total } = cartTotals(dishes, cart)
  return { categories, filtered, cartCount, subtotal, tax, total }
}

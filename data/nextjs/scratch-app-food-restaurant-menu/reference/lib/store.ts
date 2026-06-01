import type { Dish } from './types'

// In-memory server store for the API routes. SEPARATE from the client AppStateProvider
// state. Tests call __reset() in beforeEach for isolation.

let dishes: Dish[] = []
let nextId = 1

function seed(): void {
  dishes = [
    { id: 'd1', name: 'Bruschetta', category: 'Starter', price: 8, vegetarian: true },
    { id: 'd2', name: 'Caesar Salad', category: 'Starter', price: 10, vegetarian: false },
    { id: 'd3', name: 'Margherita', category: 'Main', price: 14, vegetarian: true },
    { id: 'd4', name: 'Ribeye Steak', category: 'Main', price: 28, vegetarian: false },
    { id: 'd5', name: 'Tiramisu', category: 'Dessert', price: 9, vegetarian: true },
  ]
  nextId = 6
}

seed()

export function __reset(): void {
  seed()
}

export function listDishes(filter?: {
  category?: string | null
  vegetarian?: string | null
}): Dish[] {
  let out = dishes.slice()
  const category = filter?.category
  if (category) out = out.filter((d) => d.category === category)
  const veg = filter?.vegetarian
  if (veg === 'true') out = out.filter((d) => d.vegetarian)
  else if (veg === 'false') out = out.filter((d) => !d.vegetarian)
  return out
}

export function createDish(input: {
  name: string
  category?: string
  price?: number
  vegetarian?: boolean
}): Dish {
  const dish: Dish = {
    id: `d${nextId++}`,
    name: input.name,
    category: input.category ?? 'Other',
    price: input.price ?? 0,
    vegetarian: input.vegetarian ?? false,
  }
  dishes.push(dish)
  return dish
}

export function findDish(id: string): Dish | undefined {
  return dishes.find((d) => d.id === id)
}

export function deleteDish(id: string): boolean {
  const idx = dishes.findIndex((d) => d.id === id)
  if (idx === -1) return false
  dishes.splice(idx, 1)
  return true
}

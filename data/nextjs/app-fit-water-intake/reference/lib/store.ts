import type { Drink } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let drinks: Drink[] = []
let goal = 2000
let reminders = 4
let nextId = 1

function seed(): void {
  drinks = [
    { id: 'd1', date: '2026-05-27', amount: 500 },
    { id: 'd2', date: '2026-05-27', amount: 750 },
    { id: 'd3', date: '2026-05-28', amount: 250 },
  ]
  goal = 2000
  reminders = 4
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listDrinks(): Drink[] {
  return drinks.slice()
}

export function getGoal(): number {
  return goal
}

export function setGoal(value: number): number {
  goal = value
  return goal
}

export function getReminders(): number {
  return reminders
}

export function setReminders(value: number): number {
  reminders = value
  return reminders
}

export function createDrink(input: { date: string; amount: number }): Drink {
  const drink: Drink = { id: `d${nextId++}`, date: input.date, amount: input.amount }
  drinks.push(drink)
  return drink
}

export function deleteDrink(id: string): boolean {
  const idx = drinks.findIndex((d) => d.id === id)
  if (idx === -1) return false
  drinks.splice(idx, 1)
  return true
}

export function totalForDate(date: string): number {
  let total = 0
  drinks.forEach((d) => {
    if (d.date === date) total += d.amount
  })
  return total
}

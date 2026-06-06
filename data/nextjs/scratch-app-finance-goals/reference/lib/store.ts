import { Goal, BudgetEntry } from './types'

let goals: Goal[] = [
  { id: 'g1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 4500, deadline: '2026-12-31', category: 'Savings' },
  { id: 'g2', name: 'Vacation', targetAmount: 3000, currentAmount: 3200, deadline: '2026-06-30', category: 'Travel' },
  { id: 'g3', name: 'New Laptop', targetAmount: 2000, currentAmount: 800, deadline: '2025-09-01', category: 'Tech' },
]

let budgetEntries: BudgetEntry[] = [
  { id: 'b1', category: 'Rent', amount: 1500, month: '2026-06' },
  { id: 'b2', category: 'Food', amount: 400, month: '2026-06' },
]

const SEED_GOALS: Goal[] = [
  { id: 'g1', name: 'Emergency Fund', targetAmount: 10000, currentAmount: 4500, deadline: '2026-12-31', category: 'Savings' },
  { id: 'g2', name: 'Vacation', targetAmount: 3000, currentAmount: 3200, deadline: '2026-06-30', category: 'Travel' },
  { id: 'g3', name: 'New Laptop', targetAmount: 2000, currentAmount: 800, deadline: '2025-09-01', category: 'Tech' },
]

const SEED_BUDGET: BudgetEntry[] = [
  { id: 'b1', category: 'Rent', amount: 1500, month: '2026-06' },
  { id: 'b2', category: 'Food', amount: 400, month: '2026-06' },
]

export function getGoals(): Goal[] {
  return [...goals]
}

export function addGoal(data: Omit<Goal, 'id'>): Goal {
  const goal: Goal = { id: `g${Date.now()}`, ...data }
  goals.push(goal)
  return goal
}

export function getBudgetEntries(): BudgetEntry[] {
  return [...budgetEntries]
}

export function addBudgetEntry(data: Omit<BudgetEntry, 'id'>): BudgetEntry {
  const entry: BudgetEntry = { id: `b${Date.now()}`, ...data }
  budgetEntries.push(entry)
  return entry
}

export function __reset(): void {
  goals = SEED_GOALS.map(g => ({ ...g }))
  budgetEntries = SEED_BUDGET.map(b => ({ ...b }))
}

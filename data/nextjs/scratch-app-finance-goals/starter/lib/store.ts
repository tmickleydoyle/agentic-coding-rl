import { Goal, BudgetEntry } from './types'

export function getGoals(): Goal[] {
  return []
}

export function addGoal(_data: Omit<Goal, 'id'>): Goal {
  return { id: '', name: '', targetAmount: 0, currentAmount: 0, deadline: '', category: '' }
}

export function getBudgetEntries(): BudgetEntry[] {
  return []
}

export function addBudgetEntry(_data: Omit<BudgetEntry, 'id'>): BudgetEntry {
  return { id: '', category: '', amount: 0, month: '' }
}

export function __reset(): void {}

import type { Contribution, Goal } from './types'

// In-memory server store for the API routes. SEPARATE from the client GoalsProvider state.
// Tests call __reset() in beforeEach for isolation.

let goals: Goal[] = []
let contributions: Contribution[] = []
let nextGoalId = 1
let nextContributionId = 1

function seed(): void {
  goals = [
    { id: 'g1', name: 'Emergency Fund', target: 10000, saved: 4000, monthlyContribution: 1000 },
    { id: 'g2', name: 'Vacation', target: 3000, saved: 3000, monthlyContribution: 200 },
    { id: 'g3', name: 'New Laptop', target: 2000, saved: 500, monthlyContribution: 250 },
  ]
  contributions = [
    { id: 'c1', goalId: 'g1', amount: 1000 },
    { id: 'c2', goalId: 'g1', amount: 3000 },
    { id: 'c3', goalId: 'g3', amount: 500 },
  ]
  nextGoalId = 4
  nextContributionId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listGoals(): Goal[] {
  return goals.slice()
}

export function findGoal(id: string): Goal | undefined {
  return goals.find((g) => g.id === id)
}

export function createGoal(input: {
  name: string
  target: number
  monthlyContribution?: number
  saved?: number
}): Goal {
  const goal: Goal = {
    id: `g${nextGoalId++}`,
    name: input.name,
    target: input.target,
    saved: input.saved ?? 0,
    monthlyContribution: input.monthlyContribution ?? 0,
  }
  goals.push(goal)
  return goal
}

export function deleteGoal(id: string): boolean {
  const idx = goals.findIndex((g) => g.id === id)
  if (idx === -1) return false
  goals.splice(idx, 1)
  contributions = contributions.filter((c) => c.goalId !== id)
  return true
}

export function listContributions(filter?: { goalId?: string | null }): Contribution[] {
  let out = contributions.slice()
  const goalId = filter?.goalId
  if (goalId) out = out.filter((c) => c.goalId === goalId)
  return out
}

export function createContribution(input: { goalId: string; amount: number }): Contribution {
  const contribution: Contribution = {
    id: `c${nextContributionId++}`,
    goalId: input.goalId,
    amount: input.amount,
  }
  contributions.push(contribution)
  const goal = goals.find((g) => g.id === input.goalId)
  if (goal) goal.saved += input.amount
  return contribution
}

import type { Goal } from './types'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let goals: Goal[] = []
let nextId = 1

function seed(): void {
  goals = [
    {
      id: 'g1',
      name: 'Run a 5K',
      targetDate: '2026-06-30',
      milestones: [
        { id: 'g1-m1', title: 'Buy shoes', done: true },
        { id: 'g1-m2', title: 'Run 1K', done: true },
        { id: 'g1-m3', title: 'Run 3K', done: false },
        { id: 'g1-m4', title: 'Run 5K', done: false },
      ],
    },
    {
      id: 'g2',
      name: 'Read 12 books',
      targetDate: '2026-12-31',
      milestones: [
        { id: 'g2-m1', title: 'Pick list', done: true },
        { id: 'g2-m2', title: 'Read 6', done: true },
        { id: 'g2-m3', title: 'Read 12', done: true },
      ],
    },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

function clone(goal: Goal): Goal {
  return { ...goal, milestones: goal.milestones.map((m) => ({ ...m })) }
}

export function listGoals(): Goal[] {
  return goals.map(clone)
}

export function findGoal(id: string): Goal | undefined {
  return goals.find((g) => g.id === id)
}

export function addGoal(input: { name: string; targetDate: string }): Goal {
  const id = `g${nextId++}`
  const goal: Goal = {
    id,
    name: input.name,
    targetDate: input.targetDate,
    milestones: [{ id: `${id}-m1`, title: 'Get started', done: false }],
  }
  goals.push(goal)
  return clone(goal)
}

export type ToggleResult =
  | { kind: 'ok'; goal: Goal }
  | { kind: 'no-goal' }
  | { kind: 'no-milestone' }

export function toggleMilestone(goalId: string, milestoneId: string): ToggleResult {
  const goal = goals.find((g) => g.id === goalId)
  if (!goal) return { kind: 'no-goal' }
  const ms = goal.milestones.find((m) => m.id === milestoneId)
  if (!ms) return { kind: 'no-milestone' }
  ms.done = !ms.done
  return { kind: 'ok', goal: clone(goal) }
}

export function deleteGoal(id: string): boolean {
  const idx = goals.findIndex((g) => g.id === id)
  if (idx === -1) return false
  goals.splice(idx, 1)
  return true
}

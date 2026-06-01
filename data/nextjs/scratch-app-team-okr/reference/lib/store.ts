import type { Objective } from './types'
import { clampProgress, companyProgress, objectiveProgress } from './progress'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let objectives: Objective[] = []
let nextId = 3

function seed(): void {
  objectives = [
    {
      id: 'o1',
      title: 'Grow revenue',
      owner: 'Ada',
      keyResults: [
        { id: 'kr1', title: 'Sign 10 deals', progress: 40 },
        { id: 'kr2', title: 'Cut churn', progress: 80 },
      ],
    },
    {
      id: 'o2',
      title: 'Improve quality',
      owner: 'Grace',
      keyResults: [{ id: 'kr3', title: 'Reduce bugs', progress: 100 }],
    },
  ]
  nextId = 3
}

seed()

export function __reset(): void {
  seed()
}

export function listObjectives(): Objective[] {
  return objectives.map((o) => ({ ...o, keyResults: o.keyResults.map((kr) => ({ ...kr })) }))
}

export function objectivesWithProgress(): {
  objectives: Array<Objective & { progress: number }>
  company: number
} {
  return {
    objectives: objectives.map((o) => ({
      ...o,
      keyResults: o.keyResults.map((kr) => ({ ...kr })),
      progress: objectiveProgress(o),
    })),
    company: companyProgress(objectives),
  }
}

export function findObjective(id: string): Objective | undefined {
  return objectives.find((o) => o.id === id)
}

export function createObjective(input: { title: string; owner?: string }): Objective {
  const objective: Objective = {
    id: `o${nextId++}`,
    title: input.title,
    owner: input.owner ?? '',
    keyResults: [],
  }
  objectives.push(objective)
  return objective
}

export function setKeyResultProgress(
  objectiveId: string,
  krId: string,
  progress: number,
): Objective | undefined {
  const objective = objectives.find((o) => o.id === objectiveId)
  if (!objective) return undefined
  const kr = objective.keyResults.find((k) => k.id === krId)
  if (!kr) return undefined
  kr.progress = clampProgress(progress)
  return objective
}

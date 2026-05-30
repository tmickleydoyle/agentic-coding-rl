import type { Objective } from './types'

export function clampProgress(_n: number): number {
  // TODO: clamp to an integer in [0, 100]
  return 0
}

export function objectiveProgress(_obj: Objective): number {
  // TODO: average of the objective's key result progress (0 when none), rounded
  return 0
}

export function companyProgress(_objectives: Objective[]): number {
  // TODO: average of each objective's progress (0 when none), rounded
  return 0
}

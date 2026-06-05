import type { Objective } from './types'

export function clampProgress(n: number): number {
  if (Number.isNaN(n)) return 0
  const rounded = Math.round(n)
  if (rounded < 0) return 0
  if (rounded > 100) return 100
  return rounded
}

export function objectiveProgress(obj: Objective): number {
  if (obj.keyResults.length === 0) return 0
  const sum = obj.keyResults.reduce((acc, kr) => acc + kr.progress, 0)
  return Math.round(sum / obj.keyResults.length)
}

export function companyProgress(objectives: Objective[]): number {
  if (objectives.length === 0) return 0
  const sum = objectives.reduce((acc, o) => acc + objectiveProgress(o), 0)
  return Math.round(sum / objectives.length)
}

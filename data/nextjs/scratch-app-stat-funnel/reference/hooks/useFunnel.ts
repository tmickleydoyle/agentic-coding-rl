'use client'
import { useApp } from '../components/AppStateProvider'
import type { FunnelRow, Segment, Step } from '../lib/types'

export function countFor(step: Step, segment: Segment): number {
  return step.counts[segment]
}

export function funnelRows(steps: Step[], segment: Segment): FunnelRow[] {
  const ordered = steps.slice().sort((a, b) => a.order - b.order)
  const firstCount = ordered.length > 0 ? countFor(ordered[0], segment) : 0
  const rows: FunnelRow[] = []
  for (let i = 0; i < ordered.length; i++) {
    const count = countFor(ordered[i], segment)
    let dropOff = 0
    if (i > 0) {
      const prev = countFor(ordered[i - 1], segment)
      dropOff = prev === 0 ? 0 : Math.round(((prev - count) / prev) * 100)
    }
    const conversion = firstCount === 0 ? 0 : Math.round((count / firstCount) * 100)
    rows.push({ id: ordered[i].id, name: ordered[i].name, count, dropOff, conversion })
  }
  return rows
}

export function overallConversion(steps: Step[], segment: Segment): number {
  const rows = funnelRows(steps, segment)
  return rows.length > 0 ? rows[rows.length - 1].conversion : 0
}

export function biggestDropStepId(steps: Step[], segment: Segment): string {
  const rows = funnelRows(steps, segment)
  let bestId = ''
  let bestDrop = -1
  rows.forEach((r) => {
    if (r.dropOff > bestDrop) {
      bestDrop = r.dropOff
      bestId = r.id
    }
  })
  return bestId
}

export function useFunnel() {
  const { steps, segment } = useApp()
  return {
    rows: funnelRows(steps, segment),
    overall: overallConversion(steps, segment),
    biggestDropId: biggestDropStepId(steps, segment),
  }
}

'use client'
import { useApp } from '../components/AppStateProvider'
import type { FunnelRow, Segment, Step } from '../lib/types'

export function countFor(step: Step, segment: Segment): number {
  return step.counts[segment]
}

export function funnelRows(_steps: Step[], _segment: Segment): FunnelRow[] {
  // TODO: per ordered step compute { id, name, count, dropOff, conversion } for the segment
  return []
}

export function overallConversion(_steps: Step[], _segment: Segment): number {
  // TODO: the last step's conversion (0 when empty)
  return 0
}

export function biggestDropStepId(_steps: Step[], _segment: Segment): string {
  // TODO: the id of the step with the largest drop-off (first wins on ties)
  return ''
}

export function useFunnel() {
  const { steps, segment } = useApp()
  return {
    rows: funnelRows(steps, segment),
    overall: overallConversion(steps, segment),
    biggestDropId: biggestDropStepId(steps, segment),
  }
}

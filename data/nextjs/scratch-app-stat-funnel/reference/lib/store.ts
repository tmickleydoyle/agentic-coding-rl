import type { FunnelRow, Segment, Step } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let steps: Step[] = []
let nextStepId = 1

function seed(): void {
  steps = [
    { id: 'st1', name: 'Visit', order: 1, counts: { all: 1000, mobile: 600, desktop: 400 } },
    { id: 'st2', name: 'Signup', order: 2, counts: { all: 500, mobile: 250, desktop: 250 } },
    { id: 'st3', name: 'Activate', order: 3, counts: { all: 300, mobile: 120, desktop: 180 } },
    { id: 'st4', name: 'Purchase', order: 4, counts: { all: 120, mobile: 40, desktop: 80 } },
  ]
  nextStepId = 5
}

seed()

export function __reset(): void {
  seed()
}

function sorted(): Step[] {
  return steps.slice().sort((a, b) => a.order - b.order)
}

export function listSteps(): Step[] {
  return sorted()
}

export function computeRows(input: Step[], segment: Segment): FunnelRow[] {
  const ordered = input.slice().sort((a, b) => a.order - b.order)
  const firstCount = ordered.length > 0 ? ordered[0].counts[segment] : 0
  const rows: FunnelRow[] = []
  for (let i = 0; i < ordered.length; i++) {
    const count = ordered[i].counts[segment]
    let dropOff = 0
    if (i > 0) {
      const prev = ordered[i - 1].counts[segment]
      dropOff = prev === 0 ? 0 : Math.round(((prev - count) / prev) * 100)
    }
    const conversion = firstCount === 0 ? 0 : Math.round((count / firstCount) * 100)
    rows.push({ id: ordered[i].id, name: ordered[i].name, count, dropOff, conversion })
  }
  return rows
}

export function createStep(input: {
  name: string
  all: number
  mobile?: number
  desktop?: number
}): Step {
  const maxOrder = steps.reduce((m, s) => Math.max(m, s.order), 0)
  const step: Step = {
    id: `st${nextStepId++}`,
    name: input.name,
    order: maxOrder + 1,
    counts: {
      all: input.all,
      mobile: input.mobile ?? 0,
      desktop: input.desktop ?? 0,
    },
  }
  steps.push(step)
  return step
}

export function deleteStep(id: string): boolean {
  const idx = steps.findIndex((s) => s.id === id)
  if (idx === -1) return false
  steps.splice(idx, 1)
  return true
}

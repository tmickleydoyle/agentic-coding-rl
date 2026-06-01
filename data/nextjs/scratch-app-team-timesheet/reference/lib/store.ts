import type { Day, Entry, Project } from './types'

// In-memory server store for the API routes. This is SEPARATE from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let projects: Project[] = []
let entries: Entry[] = []
let nextId = 1

function seed(): void {
  projects = [
    { id: 'p1', name: 'Alpha' },
    { id: 'p2', name: 'Bravo' },
    { id: 'p3', name: 'Carol' },
  ]
  entries = [
    { id: 'h1', projectId: 'p1', day: 'mon', hours: 4, submitted: false },
    { id: 'h2', projectId: 'p1', day: 'tue', hours: 3, submitted: false },
    { id: 'h3', projectId: 'p2', day: 'mon', hours: 5, submitted: true },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listProjects(): Project[] {
  return projects.slice()
}

export function listEntries(filter?: { projectId?: string | null; day?: string | null }): Entry[] {
  let out = entries.slice()
  if (filter?.projectId) out = out.filter((e) => e.projectId === filter.projectId)
  if (filter?.day) out = out.filter((e) => e.day === filter.day)
  return out
}

export function totalsByProject(): Record<string, number> {
  const out: Record<string, number> = {}
  projects.forEach((p) => {
    out[p.id] = 0
  })
  entries.forEach((e) => {
    out[e.projectId] = (out[e.projectId] ?? 0) + e.hours
  })
  return out
}

export function weekTotal(): number {
  return entries.reduce((acc, e) => acc + e.hours, 0)
}

export function createEntry(input: { projectId: string; day: Day; hours: number }): Entry {
  const entry: Entry = {
    id: `h${nextId++}`,
    projectId: input.projectId,
    day: input.day,
    hours: input.hours < 0 ? 0 : input.hours,
    submitted: false,
  }
  entries.push(entry)
  return entry
}

export function submitEntry(id: string): Entry | undefined {
  const entry = entries.find((e) => e.id === id)
  if (!entry) return undefined
  entry.submitted = true
  return entry
}

export function deleteEntry(id: string): boolean {
  const idx = entries.findIndex((e) => e.id === id)
  if (idx === -1) return false
  entries.splice(idx, 1)
  return true
}

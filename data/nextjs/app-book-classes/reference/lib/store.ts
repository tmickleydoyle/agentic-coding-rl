import type { Enrollment, Klass } from './types'

// In-memory server store for the API routes. Separate from the client
// AppStateProvider state. Tests call __reset() in beforeEach for isolation.

let classes: Klass[] = []
let enrollments: Enrollment[] = []
let nextId = 1

function seed(): void {
  classes = [
    { id: 'c1', name: 'Yoga', capacity: 2 },
    { id: 'c2', name: 'Pottery', capacity: 1 },
    { id: 'c3', name: 'Boxing', capacity: 3 },
  ]
  enrollments = [
    { id: 'e1', classId: 'c1', student: 'Ada', status: 'enrolled' },
    { id: 'e2', classId: 'c2', student: 'Grace', status: 'enrolled' },
    { id: 'e3', classId: 'c2', student: 'Hedy', status: 'waitlisted' },
  ]
  nextId = 4
}

seed()

export function __reset(): void {
  seed()
}

export function listClasses(): Klass[] {
  return classes.slice()
}

export function findClass(id: string): Klass | undefined {
  return classes.find((c) => c.id === id)
}

export function listEnrollments(filter?: {
  classId?: string | null
  status?: string | null
}): Enrollment[] {
  let out = enrollments.slice()
  const classId = filter?.classId
  if (classId) out = out.filter((e) => e.classId === classId)
  const status = filter?.status
  if (status === 'enrolled' || status === 'waitlisted') {
    out = out.filter((e) => e.status === status)
  }
  return out
}

export function enrolledCount(classId: string): number {
  return enrollments.filter((e) => e.classId === classId && e.status === 'enrolled').length
}

export function createEnrollment(input: { classId: string; student: string }): Enrollment {
  const klass = classes.find((c) => c.id === input.classId)
  const cap = klass ? klass.capacity : 0
  const room = enrolledCount(input.classId) < cap
  const enrollment: Enrollment = {
    id: `e${nextId++}`,
    classId: input.classId,
    student: input.student,
    status: room ? 'enrolled' : 'waitlisted',
  }
  enrollments.push(enrollment)
  return enrollment
}

export function deleteEnrollment(id: string): { ok: boolean; promotedId: string | null } {
  const idx = enrollments.findIndex((e) => e.id === id)
  if (idx === -1) return { ok: false, promotedId: null }
  const removed = enrollments[idx]
  enrollments.splice(idx, 1)
  let promotedId: string | null = null
  if (removed.status === 'enrolled') {
    const next = enrollments.find(
      (e) => e.classId === removed.classId && e.status === 'waitlisted',
    )
    if (next) {
      next.status = 'enrolled'
      promotedId = next.id
    }
  }
  return { ok: true, promotedId }
}

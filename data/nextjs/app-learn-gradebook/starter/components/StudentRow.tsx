'use client'
import type { Student } from '../lib/types'

export default function StudentRow({ student }: { student: Student }) {
  // TODO: render student-<id> row with the name.
  return <li data-testid={`student-${student.id}`} />
}

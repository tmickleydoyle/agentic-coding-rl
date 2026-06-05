'use client'
import type { Student } from '../lib/types'

export default function StudentRow({ student }: { student: Student }) {
  return (
    <li data-testid={`student-${student.id}`}>
      <span data-testid={`student-${student.id}-name`}>{student.name}</span>
    </li>
  )
}

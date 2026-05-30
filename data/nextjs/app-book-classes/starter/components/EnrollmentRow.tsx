'use client'
import type { Enrollment } from '../lib/types'

export default function EnrollmentRow({
  enrollment,
  className,
  prefix,
  onCancel,
}: {
  enrollment: Enrollment
  className: string
  prefix: string
  onCancel: (id: string) => void
}) {
  return (
    <li data-testid={`${prefix}-${enrollment.id}`}>
      <span data-testid={`${prefix}-${enrollment.id}-class`}>{className}</span>
      <span data-testid={`${prefix}-${enrollment.id}-student`}>{enrollment.student}</span>
      <button data-testid={`cancel-${enrollment.id}`} onClick={() => onCancel(enrollment.id)}>
        Cancel
      </button>
    </li>
  )
}

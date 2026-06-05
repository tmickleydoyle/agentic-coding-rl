'use client'

export default function GradeCell({
  studentId,
  assignmentId,
  value,
  onChange,
}: {
  studentId: string
  assignmentId: string
  value: number | undefined
  onChange: (raw: string) => void
}) {
  return (
    <input
      type="number"
      data-testid={`grade-${studentId}-${assignmentId}`}
      value={value === undefined ? '' : value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

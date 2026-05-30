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
  // TODO: render a number input grade-<sid>-<aid> bound to value, calling onChange.
  void value
  void onChange
  return <input type="number" data-testid={`grade-${studentId}-${assignmentId}`} />
}

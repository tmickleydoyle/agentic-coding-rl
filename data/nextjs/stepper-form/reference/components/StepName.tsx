'use client'

export default function StepName({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input data-testid="name" value={value} onChange={(e) => onChange(e.target.value)} />
  )
}

'use client'

export default function StepAge({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input data-testid="age" value={value} onChange={(e) => onChange(e.target.value)} />
  )
}

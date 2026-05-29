'use client'

export default function StepEmail({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input data-testid="email" value={value} onChange={(e) => onChange(e.target.value)} />
  )
}

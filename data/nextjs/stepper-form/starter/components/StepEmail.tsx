'use client'

// TODO: render <input data-testid="email"> bound to value, calling onChange on input.
export default function StepEmail({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return <input data-testid="email" value={value} onChange={() => {}} />
}

'use client'

// TODO: render <input data-testid="age"> bound to value, calling onChange on input.
export default function StepAge({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return <input data-testid="age" value={value} onChange={() => {}} />
}

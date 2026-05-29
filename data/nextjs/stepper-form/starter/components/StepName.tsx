'use client'

// TODO: render <input data-testid="name"> bound to value, calling onChange on input.
export default function StepName({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return <input data-testid="name" value={value} onChange={() => {}} />
}

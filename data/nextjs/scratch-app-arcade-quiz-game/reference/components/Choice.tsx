'use client'

export default function Choice({
  index,
  label,
  onChoose,
}: {
  index: number
  label: string
  onChoose: (index: number) => void
}) {
  return (
    <button data-testid={`choice-${index}`} onClick={() => onChoose(index)}>
      {label}
    </button>
  )
}

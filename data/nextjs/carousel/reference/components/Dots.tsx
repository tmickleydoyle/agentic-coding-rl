'use client'

export default function Dots({
  count,
  active,
  onJump,
}: {
  count: number
  active: number
  onJump: (index: number) => void
}) {
  return (
    <div data-testid="dots">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          data-testid={`dot-${i}`}
          aria-current={i === active ? 'true' : undefined}
          onClick={() => onJump(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}

'use client'

export default function Timer({
  remaining,
  onStart,
  onPause,
  onReset,
}: {
  remaining: number
  onStart: () => void
  onPause: () => void
  onReset: () => void
}) {
  return (
    <div data-testid="timer">
      <span data-testid="remaining">{remaining}</span>
      <button data-testid="start-timer" onClick={onStart}>
        Start
      </button>
      <button data-testid="pause-timer" onClick={onPause}>
        Pause
      </button>
      <button data-testid="reset-timer" onClick={onReset}>
        Reset
      </button>
    </div>
  )
}

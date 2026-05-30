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
  // TODO: render remaining + start-timer/pause-timer/reset-timer buttons.
  void remaining
  void onStart
  void onPause
  void onReset
  return <div data-testid="timer" />
}

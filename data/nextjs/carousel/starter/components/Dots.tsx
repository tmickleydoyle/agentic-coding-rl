'use client'

// TODO: render <div data-testid="dots"> with `count` <button data-testid="dot-<index>"> buttons.
// The active dot has aria-current="true" (others have no aria-current). Clicking a dot calls
// onJump(index).
export default function Dots({
  count,
  active,
  onJump,
}: {
  count: number
  active: number
  onJump: (index: number) => void
}) {
  return <div data-testid="dots" />
}

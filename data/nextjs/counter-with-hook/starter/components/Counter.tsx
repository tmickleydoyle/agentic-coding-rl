'use client'
import { useCounter } from '../hooks/useCounter'

export default function Counter() {
  // TODO: use the hook + wire up the three buttons.
  const { count } = useCounter(0)
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button data-testid="inc">+</button>
      <button data-testid="dec">-</button>
      <button data-testid="reset">Reset</button>
    </div>
  )
}

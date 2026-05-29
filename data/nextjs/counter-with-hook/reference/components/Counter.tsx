'use client'
import { useCounter } from '../hooks/useCounter'

export default function Counter() {
  const { count, inc, dec, reset } = useCounter(0)
  return (
    <div>
      <span data-testid="count">{count}</span>
      <button data-testid="inc" onClick={inc}>+</button>
      <button data-testid="dec" onClick={dec}>-</button>
      <button data-testid="reset" onClick={reset}>Reset</button>
    </div>
  )
}

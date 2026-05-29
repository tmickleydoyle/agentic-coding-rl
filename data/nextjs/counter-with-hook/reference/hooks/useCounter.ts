import { useState } from 'react'

export function useCounter(initial: number) {
  const [count, setCount] = useState(initial)
  return {
    count,
    inc: () => setCount((c) => c + 1),
    dec: () => setCount((c) => Math.max(0, c - 1)),
    reset: () => setCount(initial),
  }
}

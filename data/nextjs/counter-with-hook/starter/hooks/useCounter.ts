// TODO: export a hook returning { count, inc, dec (clamped at 0), reset }.
import { useState } from 'react'

export function useCounter(initial: number) {
  const [count, setCount] = useState(initial)
  return { count, inc: () => {}, dec: () => {}, reset: () => {} }
}

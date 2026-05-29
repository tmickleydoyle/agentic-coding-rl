'use client'
import { useEffect, useRef, useState } from 'react'

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const start = () => {
    intervalRef.current = setInterval(() => {
      setElapsed((e) => e + 1)
    }, 1000)
  }

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const reset = () => {
    setElapsed(0)
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div>
      <span data-testid="elapsed">{elapsed}</span>
      <button data-testid="start" onClick={start}>
        Start
      </button>
      <button data-testid="stop" onClick={stop}>
        Stop
      </button>
      <button data-testid="reset" onClick={reset}>
        Reset
      </button>
    </div>
  )
}

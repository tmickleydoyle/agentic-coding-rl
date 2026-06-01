'use client'
import { useEffect, useRef, useState } from 'react'

export function useTimer(seconds: number, onDone: () => void) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(false)
  // bumped each time the countdown reaches zero; drives the onDone effect.
  const [doneCount, setDoneCount] = useState(0)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          setRunning(false)
          setDoneCount((n) => n + 1)
          return seconds // session complete: roll back to a full session
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running, seconds])

  useEffect(() => {
    if (doneCount > 0) onDoneRef.current()
    // only react to a new completion, not to onDone identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doneCount])

  const start = () => {
    if (remaining > 0) setRunning(true)
  }
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setRemaining(seconds)
  }
  const tick = () => setRemaining((r) => Math.max(0, r - 1))

  return { remaining, running, start, pause, reset, tick }
}

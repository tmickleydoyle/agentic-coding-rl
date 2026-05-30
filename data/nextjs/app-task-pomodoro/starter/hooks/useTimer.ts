'use client'
import { useState } from 'react'

export function useTimer(seconds: number, _onDone: () => void) {
  // TODO: count down one second per second with setInterval(1000) while running; when
  // remaining hits 0, stop and call onDone exactly once. start/pause/reset control it.
  const [remaining] = useState(seconds)
  return {
    remaining,
    running: false,
    start: () => {},
    pause: () => {},
    reset: () => {},
    tick: () => {},
  }
}

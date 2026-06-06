'use client'
import { useState, useEffect, useRef } from 'react'

interface SessionEntry {
  id: number
  minutes: number
}

const PRESETS = [25, 10, 5]

export default function App() {
  const [selectedMinutes, setSelectedMinutes] = useState(25)
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [running, setRunning] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const [log, setLog] = useState<SessionEntry[]>([])

  const sessionMinutesRef = useRef(25)

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(id)
          setRunning(false)
          setLog(l => [...l, { id: Date.now(), minutes: sessionMinutesRef.current }])
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  function selectPreset(min: number) {
    setRunning(false)
    setSelectedMinutes(min)
    setSecondsLeft(min * 60)
    sessionMinutesRef.current = min
  }

  function setCustom() {
    const val = parseInt(customInput, 10)
    if (!val || val <= 0) return
    setRunning(false)
    setSelectedMinutes(val)
    setSecondsLeft(val * 60)
    sessionMinutesRef.current = val
    setCustomInput('')
  }

  function toggleRunning() {
    setRunning(r => !r)
  }

  function reset() {
    setRunning(false)
    setSecondsLeft(selectedMinutes * 60)
  }

  function clearLog() {
    setLog([])
  }

  const mins = Math.floor(secondsLeft / 60).toString().padStart(2, '0')
  const secs = (secondsLeft % 60).toString().padStart(2, '0')
  const display = `${mins}:${secs}`

  const status = running ? 'Running' : secondsLeft === 0 ? 'Ready' : 'Ready'
  const statusLabel = running ? 'Running' : 'Ready'

  return (
    <div>
      <h1>Focus Timer</h1>
      <p data-testid="timer-display">{display}</p>
      <p data-testid="session-status">{statusLabel}</p>
      <div>
        {PRESETS.map(p => (
          <button key={p} onClick={() => selectPreset(p)}>{p} min</button>
        ))}
      </div>
      <input
        type="number"
        aria-label="Custom minutes"
        value={customInput}
        onChange={e => setCustomInput(e.target.value)}
      />
      <button onClick={setCustom}>Set Custom</button>
      <button onClick={toggleRunning}>{running ? 'Pause' : 'Start'}</button>
      <button onClick={reset}>Reset</button>
      <div>
        <p data-testid="session-count">Sessions: {log.length}</p>
        <button onClick={clearLog}>Clear Log</button>
        <ul>
          {log.map(entry => (
            <li key={entry.id} data-testid="session-log-item">{entry.minutes} min session</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

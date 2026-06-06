'use client'
import { useState, useRef } from 'react'

const PASSAGE = "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump."

export default function App() {
  const [typed, setTyped] = useState('')
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const startTimeRef = useRef<number | null>(null)

  function computeStats(text: string) {
    const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0
    // accuracy
    let correctChars = 0
    for (let i = 0; i < text.length; i++) {
      if (text[i] === PASSAGE[i]) correctChars++
    }
    const acc = text.length === 0 ? 100 : Math.round((correctChars / text.length) * 100)
    // wpm
    const passageWords = PASSAGE.split(' ')
    const typedWords = text.split(' ')
    let correctWords = 0
    for (let i = 0; i < typedWords.length; i++) {
      if (typedWords[i] === passageWords[i]) correctWords++
    }
    const elapsedMinutes = elapsed / 60
    const w = elapsedMinutes > 0 ? Math.round(correctWords / elapsedMinutes) : 0
    return { acc, w }
  }

  function handleStart() {
    startTimeRef.current = Date.now()
    setStarted(true)
    setFinished(false)
    setTyped('')
    setWpm(0)
    setAccuracy(100)
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value
    setTyped(text)
    const { acc, w } = computeStats(text)
    setAccuracy(acc)
    setWpm(w)
    if (text.length >= PASSAGE.length) {
      setFinished(true)
    }
  }

  function handleReset() {
    setTyped('')
    setStarted(false)
    setFinished(false)
    setWpm(0)
    setAccuracy(100)
    startTimeRef.current = null
  }

  let status = 'Press Start to begin'
  if (started && !finished) status = 'Typing...'
  if (finished) status = 'Finished!'

  const disabled = !started || finished

  return (
    <div>
      <h1>Typing Test</h1>
      <p data-testid="passage">{PASSAGE}</p>
      <textarea
        aria-label="Type here"
        value={typed}
        onChange={handleChange}
        disabled={disabled}
      />
      {!started && <button onClick={handleStart}>Start</button>}
      {started && <button onClick={handleReset}>Reset</button>}
      <p data-testid="wpm">WPM: {wpm}</p>
      <p data-testid="accuracy">Accuracy: {accuracy}%</p>
      <p data-testid="status">{status}</p>
    </div>
  )
}

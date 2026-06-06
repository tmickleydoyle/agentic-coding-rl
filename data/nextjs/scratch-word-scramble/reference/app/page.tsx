'use client'
import { useState } from 'react'

const WORDS = [
  { word: 'react', scrambled: 'acter' },
  { word: 'typescript', scrambled: 'crsyptitep' },
  { word: 'component', scrambled: 'mponnoect' },
  { word: 'function', scrambled: 'nticonfun' },
  { word: 'variable', scrambled: 'blaavire' },
]

export default function App() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState('')
  const done = index >= WORDS.length

  function advance(next: number) {
    setIndex(next)
    setGuess('')
  }

  function handleSubmit() {
    if (!guess.trim()) return
    const current = WORDS[index]
    if (guess.trim().toLowerCase() === current.word) {
      setScore(s => s + 1)
      setFeedback('Correct!')
    } else {
      setFeedback(`Wrong! The word was: ${current.word}`)
    }
    advance(index + 1)
  }

  function handleSkip() {
    const current = WORDS[index]
    setFeedback(`Skipped! The word was: ${current.word}`)
    advance(index + 1)
  }

  return (
    <div>
      <h1>Word Scramble</h1>
      <p data-testid="score">Score: {score} / {WORDS.length}</p>
      {!done && (
        <>
          <p data-testid="scrambled">{WORDS[index].scrambled}</p>
          <p data-testid="progress">Word {index + 1} of {WORDS.length}</p>
          <input
            aria-label="Your answer"
            value={guess}
            onChange={e => setGuess(e.target.value)}
          />
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleSkip}>Skip</button>
        </>
      )}
      <p data-testid="feedback">{feedback}</p>
      {done && (
        <p data-testid="result">Game Over! You scored {score} out of {WORDS.length}.</p>
      )}
    </div>
  )
}

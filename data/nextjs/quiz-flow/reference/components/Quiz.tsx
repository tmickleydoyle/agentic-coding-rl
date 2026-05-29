'use client'
import { useState } from 'react'

type Q = { prompt: string; choices: string[]; answer: number }

export default function Quiz({ questions }: { questions: Q[] }) {
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const total = questions.length

  const restart = () => {
    setIdx(0)
    setScore(0)
  }

  if (idx >= total) {
    return (
      <div>
        <p data-testid="result">{score}/{total}</p>
        <button data-testid="restart" onClick={restart}>Restart</button>
      </div>
    )
  }

  const q = questions[idx]
  const onChoose = (i: number) => {
    if (i === q.answer) setScore((s) => s + 1)
    setIdx((n) => n + 1)
  }

  return (
    <div>
      <h2 data-testid="prompt">{q.prompt}</h2>
      <span data-testid="progress">Question {idx + 1}/{total}</span>
      {q.choices.map((c, i) => (
        <button key={i} data-testid={`choice-${i}`} onClick={() => onChoose(i)}>
          {c}
        </button>
      ))}
    </div>
  )
}

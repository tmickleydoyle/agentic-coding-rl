'use client'
import { useState } from 'react'

type Question = { prompt: string; options: string[]; correct: number }
const QUESTIONS: Question[] = [
  { prompt: 'What is 2 + 2?', options: ['3', '4', '5'], correct: 1 },
  { prompt: 'Capital of France?', options: ['London', 'Paris', 'Rome'], correct: 1 },
  { prompt: 'Largest planet?', options: ['Earth', 'Mars', 'Jupiter'], correct: 2 },
]

export default function App() {
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(QUESTIONS.map(() => null))
  const [submitted, setSubmitted] = useState(false)

  function select(optIdx: number) {
    setAnswers((a) => {
      const next = [...a]
      next[idx] = optIdx
      return next
    })
  }

  function restart() {
    setAnswers(QUESTIONS.map(() => null))
    setIdx(0)
    setSubmitted(false)
  }

  if (submitted) {
    const score = answers.filter((a, i) => a === QUESTIONS[i].correct).length
    const pct = Math.round((score / QUESTIONS.length) * 100)
    const passed = pct >= 70
    return (
      <div>
        <h1>Quiz</h1>
        <p>{`You scored ${score} of ${QUESTIONS.length} (${pct}%)`}</p>
        <p>{passed ? 'Passed' : 'Failed'}</p>
        <ul>
          {QUESTIONS.map((qq, i) => (
            <li key={i}>
              {`Question ${i + 1}: ${answers[i] === qq.correct ? 'Correct' : 'Incorrect'}`}
            </li>
          ))}
        </ul>
        <button onClick={restart}>Restart</button>
      </div>
    )
  }

  const q = QUESTIONS[idx]
  return (
    <div>
      <h1>Quiz</h1>
      <p>{`Question ${idx + 1} of ${QUESTIONS.length}`}</p>
      <fieldset>
        <legend>{q.prompt}</legend>
        {q.options.map((opt, oi) => (
          <label key={opt}>
            <input
              type="radio"
              name={`q${idx}`}
              checked={answers[idx] === oi}
              onChange={() => select(oi)}
            />
            {opt}
          </label>
        ))}
      </fieldset>
      <div>
        <button disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
          Previous
        </button>
        <button disabled={idx === QUESTIONS.length - 1} onClick={() => setIdx((i) => i + 1)}>
          Next
        </button>
        <button onClick={() => setSubmitted(true)}>Submit</button>
      </div>
    </div>
  )
}

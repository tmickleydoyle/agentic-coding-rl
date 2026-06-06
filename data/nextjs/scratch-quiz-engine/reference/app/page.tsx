'use client'
import { useState } from 'react'

interface Question {
  id: number
  text: string
  options: string[]
  correctIndex: number
}

const QUESTIONS: Question[] = [
  { id: 1, text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctIndex: 1 },
  { id: 2, text: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], correctIndex: 2 },
  { id: 3, text: 'Which planet is closest to the Sun?', options: ['Venus', 'Earth', 'Mars', 'Mercury'], correctIndex: 3 },
  { id: 4, text: 'What color do you get mixing red and blue?', options: ['Green', 'Purple', 'Orange', 'Yellow'], correctIndex: 1 },
  { id: 5, text: 'How many sides does a hexagon have?', options: ['5', '7', '6', '8'], correctIndex: 2 },
]

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const question = QUESTIONS[currentIndex]
  const isLast = currentIndex === QUESTIONS.length - 1
  const isCorrect = selectedIndex === question.correctIndex

  function selectAnswer(index: number) {
    if (selectedIndex !== null) return
    setSelectedIndex(index)
    if (index === question.correctIndex) {
      setScore(s => s + 1)
    }
  }

  function next() {
    setSelectedIndex(null)
    setCurrentIndex(i => i + 1)
  }

  function finish() {
    setFinished(true)
  }

  function restart() {
    setCurrentIndex(0)
    setSelectedIndex(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    return (
      <div>
        <h1>Results</h1>
        <p data-testid="score">You scored {score} / {QUESTIONS.length}</p>
        <button onClick={restart}>Restart</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Quiz Engine</h1>
      <p data-testid="progress">Question {currentIndex + 1} of {QUESTIONS.length}</p>
      <p data-testid="question">{question.text}</p>
      <div>
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => selectAnswer(i)}
            disabled={selectedIndex !== null}
          >
            {String.fromCharCode(65 + i)}) {opt}
          </button>
        ))}
      </div>
      {selectedIndex !== null && (
        <>
          <p data-testid="feedback">
            {isCorrect
              ? 'Correct!'
              : `Wrong! The answer was ${question.options[question.correctIndex]}`}
          </p>
          {isLast ? (
            <button onClick={finish}>Finish</button>
          ) : (
            <button onClick={next}>Next</button>
          )}
        </>
      )}
    </div>
  )
}

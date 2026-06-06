'use client'
import { useState } from 'react'

interface Question {
  id: number
  question: string
  options: string[]
  answer: number
}

const QUESTIONS: Question[] = [
  { id: 1, question: 'Which is correct?', options: ['She go to school', 'She goes to school', 'She going to school', 'She gone to school'], answer: 1 },
  { id: 2, question: 'Choose the correct form:', options: ['They was happy', 'They were happy', 'They be happy', 'They been happy'], answer: 1 },
  { id: 3, question: 'Pick the right word:', options: ['Its raining', "It's raining", "Its' raining", 'It raining'], answer: 1 },
  { id: 4, question: 'Which sentence is correct?', options: ['I have went', 'I have go', 'I have gone', 'I have going'], answer: 2 },
  { id: 5, question: 'Select the correct option:', options: ['Their going home', 'There going home', "They're going home", 'Theyre going home'], answer: 2 },
]

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const question = QUESTIONS[currentIndex]
  const isLastQuestion = currentIndex === QUESTIONS.length - 1
  const isCorrect = selectedOption === question.answer

  function handleOption(i: number) {
    if (selectedOption !== null) return
    setSelectedOption(i)
    if (i === question.answer) {
      setScore(s => s + 1)
    }
  }

  function handleNext() {
    if (isLastQuestion) {
      setDone(true)
    } else {
      setCurrentIndex(idx => idx + 1)
      setSelectedOption(null)
    }
  }

  function handleRestart() {
    setCurrentIndex(0)
    setScore(0)
    setSelectedOption(null)
    setDone(false)
  }

  if (done) {
    return (
      <div>
        <h1>Grammar Quiz</h1>
        <div data-testid="final-score">Final Score: {score} / {QUESTIONS.length}</div>
        <button data-testid="restart-btn" onClick={handleRestart}>Restart</button>
      </div>
    )
  }

  return (
    <div>
      <h1>Grammar Quiz</h1>
      <div data-testid="question-number">Question {currentIndex + 1} of {QUESTIONS.length}</div>
      <div data-testid="score">Score: {score}</div>
      <div data-testid="question-text">{question.question}</div>

      <div>
        {question.options.map((opt, i) => (
          <button
            key={i}
            data-testid={`option-${i}`}
            onClick={() => handleOption(i)}
            disabled={selectedOption !== null}
          >
            {opt}
          </button>
        ))}
      </div>

      {selectedOption !== null && (
        <>
          <div data-testid="feedback">
            {isCorrect
              ? 'Correct!'
              : `Incorrect. The answer is: ${question.options[question.answer]}`}
          </div>
          <button data-testid="next-btn" onClick={handleNext}>
            {isLastQuestion ? 'Finish' : 'Next'}
          </button>
        </>
      )}
    </div>
  )
}

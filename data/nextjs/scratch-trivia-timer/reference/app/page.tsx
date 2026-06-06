'use client'
import { useState, useEffect, useRef } from 'react'

const QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which planet is closest to the Sun?",
    options: ["Venus", "Mercury", "Earth", "Mars"],
    answer: "Mercury",
  },
  {
    question: "What is 7 × 8?",
    options: ["54", "56", "58", "64"],
    answer: "56",
  },
  {
    question: "Who wrote Romeo and Juliet?",
    options: ["Dickens", "Shakespeare", "Austen", "Hemingway"],
    answer: "Shakespeare",
  },
  {
    question: "What is the chemical symbol for water?",
    options: ["O2", "CO2", "H2O", "NaCl"],
    answer: "H2O",
  },
]
const TIME_PER_QUESTION = 15

export default function App() {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [feedback, setFeedback] = useState('')
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const answeredRef = useRef(false)

  function clearTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function startTimer() {
    clearTimer()
    answeredRef.current = false
    setTimeLeft(TIME_PER_QUESTION)
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  function advanceQuestion(nextIndex: number) {
    if (nextIndex >= QUESTIONS.length) {
      setDone(true)
      clearTimer()
    } else {
      setIndex(nextIndex)
      startTimer()
      setFeedback('')
    }
  }

  // Handle timeout
  useEffect(() => {
    if (timeLeft === 0 && !done && !answeredRef.current) {
      answeredRef.current = true
      clearTimer()
      const current = QUESTIONS[index]
      setFeedback(`Incorrect! Answer: ${current.answer}`)
      setTimeout(() => advanceQuestion(index + 1), 1000)
    }
  }, [timeLeft])

  // Start timer on mount
  useEffect(() => {
    startTimer()
    return () => clearTimer()
  }, [])

  function handleAnswer(option: string) {
    if (answeredRef.current || done) return
    answeredRef.current = true
    clearTimer()
    const current = QUESTIONS[index]
    if (option === current.answer) {
      setScore(s => s + 1)
      setFeedback('Correct!')
    } else {
      setFeedback(`Incorrect! Answer: ${current.answer}`)
    }
    setTimeout(() => advanceQuestion(index + 1), 1000)
  }

  if (done) {
    return (
      <div>
        <h1>Trivia Timer</h1>
        <p data-testid="score">Score: {score}</p>
        <p data-testid="final-score">Final Score: {score} / {QUESTIONS.length}</p>
      </div>
    )
  }

  const current = QUESTIONS[index]

  return (
    <div>
      <h1>Trivia Timer</h1>
      <p data-testid="question-number">Question {index + 1} of {QUESTIONS.length}</p>
      <p data-testid="question-text">{current.question}</p>
      {current.options.map(opt => (
        <button key={opt} data-testid="option" onClick={() => handleAnswer(opt)}>
          {opt}
        </button>
      ))}
      <p data-testid="timer">Time: {timeLeft}</p>
      <p data-testid="feedback">{feedback}</p>
      <p data-testid="score">Score: {score}</p>
    </div>
  )
}

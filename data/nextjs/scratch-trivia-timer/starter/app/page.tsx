'use client'
import { useState } from 'react'

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

export default function App() {
  const [_index, _setIndex] = useState(0)

  return (
    <div>
      <h1>Trivia Timer</h1>
      <p data-testid="question-number">Question 1 of 5</p>
      <p data-testid="question-text">{QUESTIONS[0].question}</p>
      {QUESTIONS[0].options.map(opt => (
        <button key={opt} data-testid="option">{opt}</button>
      ))}
      <p data-testid="timer">Time: 15</p>
      <p data-testid="feedback"></p>
      <p data-testid="score">Score: 0</p>
    </div>
  )
}

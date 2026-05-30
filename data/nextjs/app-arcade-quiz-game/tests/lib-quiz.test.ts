import { describe, it, expect } from 'vitest'
import {
  QUESTIONS,
  categories,
  questionsByCategory,
  startQuiz,
  answer,
  currentQuestion,
  maxScore,
} from '../lib/quiz'

describe('quiz lib', () => {
  it('has the fixed six-question bank', () => {
    expect(QUESTIONS.map((q) => q.id)).toEqual(['q1', 'q2', 'q3', 'q4', 'q5', 'q6'])
  })

  it('lists distinct categories in order', () => {
    expect(categories()).toEqual(['Geography', 'Science', 'Math'])
  })

  it('filters questions by category, null = all', () => {
    expect(questionsByCategory('Science').map((q) => q.id)).toEqual(['q3', 'q4'])
    expect(questionsByCategory(null).length).toBe(6)
  })

  it('startQuiz seeds index/score/answers and not done', () => {
    const s = startQuiz('Geography')
    expect(s.questionIds).toEqual(['q1', 'q2'])
    expect(s.index).toBe(0)
    expect(s.score).toBe(0)
    expect(s.answers).toEqual([])
    expect(s.done).toBe(false)
  })

  it('currentQuestion returns the question at index', () => {
    const s = startQuiz('Geography')
    expect(currentQuestion(s)?.id).toBe('q1')
  })

  it('answer adds 10 for a correct choice and advances', () => {
    let s = startQuiz('Geography')
    s = answer(s, 0) // q1 correct (Paris)
    expect(s.score).toBe(10)
    expect(s.index).toBe(1)
    expect(s.answers).toEqual([0])
    expect(s.done).toBe(false)
  })

  it('answer adds nothing for a wrong choice', () => {
    let s = startQuiz('Geography')
    s = answer(s, 2) // wrong
    expect(s.score).toBe(0)
  })

  it('finishing the last question sets done', () => {
    let s = startQuiz('Geography')
    s = answer(s, 0) // q1
    s = answer(s, 1) // q2 correct
    expect(s.done).toBe(true)
    expect(s.score).toBe(20)
    expect(currentQuestion(s)).toBeNull()
  })

  it('answer on a finished quiz is a no-op (same reference)', () => {
    let s = startQuiz('Geography')
    s = answer(s, 0)
    s = answer(s, 1)
    expect(answer(s, 0)).toBe(s)
  })

  it('maxScore is ten per question', () => {
    expect(maxScore(startQuiz('Geography'))).toBe(20)
    expect(maxScore(startQuiz(null))).toBe(60)
  })

  it('startQuiz on an empty category is immediately done', () => {
    const s = startQuiz('Nope')
    expect(s.questionIds).toEqual([])
    expect(s.done).toBe(true)
  })
})

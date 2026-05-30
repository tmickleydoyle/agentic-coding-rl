'use client'
import { useApp } from '../components/AppStateProvider'
import type { Answers, Quiz } from '../lib/types'

export type Score = {
  correct: number
  total: number
  passed: boolean
}

export function scoreQuiz(quiz: Quiz, answers: Answers): Score {
  let correct = 0
  quiz.questions.forEach((q) => {
    if (answers[q.id] === q.answerId) correct += 1
  })
  return { correct, total: quiz.questions.length, passed: correct >= quiz.passScore }
}

export function findQuiz(quizzes: Quiz[], id: string | null): Quiz | undefined {
  if (!id) return undefined
  return quizzes.find((q) => q.id === id)
}

export function useActiveQuiz(): { quiz: Quiz | undefined; score: Score | null } {
  const { quizzes, activeQuizId, answers } = useApp()
  const quiz = findQuiz(quizzes, activeQuizId)
  const score = quiz ? scoreQuiz(quiz, answers) : null
  return { quiz, score }
}

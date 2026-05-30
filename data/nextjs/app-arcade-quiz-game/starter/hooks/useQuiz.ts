'use client'
import { useApp } from '../components/AppStateProvider'
import { currentQuestion } from '../lib/quiz'

export function useQuiz() {
  const { quiz } = useApp()
  return {
    current: currentQuestion(quiz),
    total: quiz.questionIds.length,
    answered: quiz.answers.length,
    score: quiz.score,
    done: quiz.done,
  }
}

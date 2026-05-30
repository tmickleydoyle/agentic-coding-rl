import type { Quiz } from './types'
import { seedQuizzes } from './seed'

// In-memory server store for the API routes. SEPARATE from the client provider state.
// Tests call __reset() in beforeEach so each test starts from the same seed.

let quizzes: Quiz[] = []

function seed(): void {
  quizzes = seedQuizzes()
}

seed()

export function __reset(): void {
  seed()
}

export function listQuizzes(): Quiz[] {
  return quizzes.slice()
}

export function findQuiz(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id)
}

export function gradeQuiz(
  quiz: Quiz,
  answers: Record<string, string>,
): { correct: number; total: number; passed: boolean } {
  let correct = 0
  quiz.questions.forEach((q) => {
    if (answers[q.id] === q.answerId) correct += 1
  })
  return { correct, total: quiz.questions.length, passed: correct >= quiz.passScore }
}

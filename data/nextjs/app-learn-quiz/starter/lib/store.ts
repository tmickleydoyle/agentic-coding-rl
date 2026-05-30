import type { Quiz } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `quizzes`; seed them from seedQuizzes(); provide __reset() to
// re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listQuizzes(): Quiz[] {
  // TODO: return all quizzes
  return []
}

export function findQuiz(_id: string): Quiz | undefined {
  // TODO: look up a quiz by id
  return undefined
}

export function gradeQuiz(
  _quiz: Quiz,
  _answers: Record<string, string>,
): { correct: number; total: number; passed: boolean } {
  // TODO: count correct answers and compare against passScore
  return { correct: 0, total: 0, passed: false }
}

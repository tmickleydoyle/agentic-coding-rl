import type { Question, QuizState } from './types'

// Fixed question bank + pure quiz logic. No React. The stubs below compile but are wrong.
// TODO: populate QUESTIONS with the six-question bank from the spec.
export const QUESTIONS: Question[] = []

export function categories(): string[] {
  // TODO: distinct categories in first-seen order
  return []
}

export function questionsByCategory(_category: string | null): Question[] {
  // TODO: questions for a category, or all when null
  return []
}

export function startQuiz(_category: string | null): QuizState {
  // TODO: seed a quiz state from the chosen category
  return { questionIds: [], index: 0, score: 0, answers: [], done: true }
}

export function currentQuestion(
  _state: QuizState,
  _bank: Question[] = QUESTIONS,
): Question | null {
  // TODO: the question at index, or null when done/out of range
  return null
}

export function answer(
  state: QuizState,
  _choice: number,
  _bank: Question[] = QUESTIONS,
): QuizState {
  // TODO: record the choice, add 10 if correct, advance and set done
  return state
}

export function maxScore(_state: QuizState): number {
  // TODO: ten points per question
  return 0
}

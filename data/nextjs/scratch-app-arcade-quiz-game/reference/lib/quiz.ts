import type { Question, QuizState } from './types'

// Fixed question bank + pure quiz logic. No React. Unit-tested directly.

export const QUESTIONS: Question[] = [
  { id: 'q1', category: 'Geography', prompt: 'Capital of France?', choices: ['Paris', 'Rome', 'Berlin'], answer: 0 },
  { id: 'q2', category: 'Geography', prompt: 'Largest ocean?', choices: ['Atlantic', 'Pacific', 'Indian'], answer: 1 },
  { id: 'q3', category: 'Science', prompt: 'Symbol for water?', choices: ['CO2', 'O2', 'H2O'], answer: 2 },
  { id: 'q4', category: 'Science', prompt: 'Planets in the solar system?', choices: ['7', '8', '9'], answer: 1 },
  { id: 'q5', category: 'Math', prompt: '6 × 7?', choices: ['42', '36', '48'], answer: 0 },
  { id: 'q6', category: 'Math', prompt: 'Square root of 81?', choices: ['7', '8', '9'], answer: 2 },
]

export function categories(): string[] {
  const out: string[] = []
  QUESTIONS.forEach((q) => {
    if (out.indexOf(q.category) === -1) out.push(q.category)
  })
  return out
}

export function questionsByCategory(category: string | null): Question[] {
  if (category === null) return QUESTIONS.slice()
  return QUESTIONS.filter((q) => q.category === category)
}

export function startQuiz(category: string | null): QuizState {
  const questionIds = questionsByCategory(category).map((q) => q.id)
  return {
    questionIds,
    index: 0,
    score: 0,
    answers: [],
    done: questionIds.length === 0,
  }
}

export function currentQuestion(
  state: QuizState,
  bank: Question[] = QUESTIONS,
): Question | null {
  if (state.done || state.index >= state.questionIds.length) return null
  const id = state.questionIds[state.index]
  return bank.find((q) => q.id === id) ?? null
}

export function answer(
  state: QuizState,
  choice: number,
  bank: Question[] = QUESTIONS,
): QuizState {
  if (state.done) return state
  const q = currentQuestion(state, bank)
  const correct = q ? choice === q.answer : false
  const nextIndex = state.index + 1
  return {
    ...state,
    index: nextIndex,
    score: state.score + (correct ? 10 : 0),
    answers: state.answers.concat(choice),
    done: nextIndex >= state.questionIds.length,
  }
}

export function maxScore(state: QuizState): number {
  return state.questionIds.length * 10
}

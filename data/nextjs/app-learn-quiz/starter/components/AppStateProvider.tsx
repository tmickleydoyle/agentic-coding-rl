'use client'
import { createContext, useContext, type ReactNode } from 'react'
import type { Answers, Quiz, Route, Theme } from '../lib/types'

type AppApi = {
  quizzes: Quiz[]
  theme: Theme
  route: Route
  activeQuizId: string | null
  answers: Answers
  submitted: boolean
  startQuiz: (id: string) => void
  selectAnswer: (questionId: string, choiceId: string) => void
  submitQuiz: () => void
  resetAttempt: () => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const STUB: AppApi = {
  quizzes: [],
  theme: 'light',
  route: 'quizzes',
  activeQuizId: null,
  answers: {},
  submitted: false,
  startQuiz: () => {},
  selectAnswer: () => {},
  submitQuiz: () => {},
  resetAttempt: () => {},
  setTheme: () => {},
  navigate: () => {},
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  // TODO: hold quizzes/theme/route/activeQuizId/answers/submitted in state (seed via
  // seedQuizzes()), implement the actions, and provide them through AppContext. The STUB
  // below makes the app mount but does nothing — replace it with real state + actions.
  return <AppContext.Provider value={STUB}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}

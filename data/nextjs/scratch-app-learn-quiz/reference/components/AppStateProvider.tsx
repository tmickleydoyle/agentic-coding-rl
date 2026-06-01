'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Answers, Quiz, Route, Theme } from '../lib/types'
import { seedQuizzes } from '../lib/seed'

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

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [quizzes] = useState<Quiz[]>(() => seedQuizzes())
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('quizzes')
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)

  const value = useMemo<AppApi>(() => {
    const startQuiz = (id: string) => {
      setActiveQuizId(id)
      setAnswers({})
      setSubmitted(false)
      setRoute('take')
    }
    const selectAnswer = (questionId: string, choiceId: string) => {
      if (submitted) return
      setAnswers((prev) => ({ ...prev, [questionId]: choiceId }))
    }
    const submitQuiz = () => {
      setSubmitted(true)
      setRoute('results')
    }
    const resetAttempt = () => {
      setAnswers({})
      setSubmitted(false)
    }
    const navigate = (next: Route) => setRoute(next)
    return {
      quizzes,
      theme,
      route,
      activeQuizId,
      answers,
      submitted,
      startQuiz,
      selectAnswer,
      submitQuiz,
      resetAttempt,
      setTheme,
      navigate,
    }
  }, [quizzes, theme, route, activeQuizId, answers, submitted])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}

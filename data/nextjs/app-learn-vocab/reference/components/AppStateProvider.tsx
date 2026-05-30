'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Route, Theme, VocabList, Word } from '../lib/types'
import { seedLists } from '../lib/seed'
import { checkAnswer, nextMastery } from '../lib/vocab'

type AppApi = {
  lists: VocabList[]
  theme: Theme
  route: Route
  activeListId: string | null
  practiceIndex: number
  openList: (listId: string) => void
  answerWord: (listId: string, wordId: string, guess: string) => boolean
  nextWord: () => void
  addWord: (listId: string, input: { term: string; answer: string }) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [lists, setLists] = useState<VocabList[]>(() => seedLists())
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('lists')
  const [activeListId, setActiveListId] = useState<string | null>(null)
  const [practiceIndex, setPracticeIndex] = useState(0)

  const value = useMemo<AppApi>(() => {
    const openList = (listId: string) => {
      setActiveListId(listId)
      setPracticeIndex(0)
      setRoute('practice')
    }

    const answerWord = (listId: string, wordId: string, guess: string): boolean => {
      const list = lists.find((l) => l.id === listId)
      const word = list?.words.find((w) => w.id === wordId)
      if (!word) return false
      const correct = checkAnswer(word, guess)
      setLists((prev) =>
        prev.map((l) => {
          if (l.id !== listId) return l
          return {
            ...l,
            words: l.words.map((w) =>
              w.id === wordId ? { ...w, mastery: nextMastery(w.mastery, correct) } : w,
            ),
          }
        }),
      )
      return correct
    }

    const nextWord = () => {
      const list = lists.find((l) => l.id === activeListId)
      const len = list ? list.words.length : 0
      setPracticeIndex((i) => (len === 0 ? 0 : (i + 1) % len))
    }

    const addWord = (listId: string, input: { term: string; answer: string }) => {
      setLists((prev) =>
        prev.map((l) => {
          if (l.id !== listId) return l
          let n = l.words.length + 1
          while (l.words.some((w) => w.id === `${listId}-w${n}`)) n += 1
          const word: Word = { id: `${listId}-w${n}`, term: input.term, answer: input.answer, mastery: 0 }
          return { ...l, words: [...l.words, word] }
        }),
      )
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      lists,
      theme,
      route,
      activeListId,
      practiceIndex,
      openList,
      answerWord,
      nextWord,
      addWord,
      setTheme,
      navigate,
    }
  }, [lists, theme, route, activeListId, practiceIndex])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}

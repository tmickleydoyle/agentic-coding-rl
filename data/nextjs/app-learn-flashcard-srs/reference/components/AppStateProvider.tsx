'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Card, Deck, Grade, Route, Theme } from '../lib/types'
import { TODAY } from '../lib/types'
import { seedDecks } from '../lib/seed'
import { reschedule } from '../lib/srs'

type AppApi = {
  decks: Deck[]
  theme: Theme
  route: Route
  activeDeckId: string | null
  openDeck: (deckId: string) => void
  gradeCard: (deckId: string, cardId: string, grade: Grade) => void
  addCard: (deckId: string, input: { front: string; back: string }) => void
  setActiveDeck: (deckId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [decks, setDecks] = useState<Deck[]>(() => seedDecks())
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('decks')
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null)

  const value = useMemo<AppApi>(() => {
    const openDeck = (deckId: string) => {
      setActiveDeckId(deckId)
      setRoute('review')
    }

    const gradeCard = (deckId: string, cardId: string, grade: Grade) => {
      setDecks((prev) =>
        prev.map((d) => {
          if (d.id !== deckId) return d
          return {
            ...d,
            cards: d.cards.map((c) => (c.id === cardId ? reschedule(c, grade) : c)),
          }
        }),
      )
    }

    const addCard = (deckId: string, input: { front: string; back: string }) => {
      setDecks((prev) =>
        prev.map((d) => {
          if (d.id !== deckId) return d
          let n = d.cards.length + 1
          while (d.cards.some((c) => c.id === `${deckId}-c${n}`)) n += 1
          const card: Card = {
            id: `${deckId}-c${n}`,
            front: input.front,
            back: input.back,
            dueDay: TODAY,
            interval: 0,
          }
          return { ...d, cards: [...d.cards, card] }
        }),
      )
    }

    const setActiveDeck = (deckId: string) => setActiveDeckId(deckId)
    const navigate = (next: Route) => setRoute(next)

    return {
      decks,
      theme,
      route,
      activeDeckId,
      openDeck,
      gradeCard,
      addCard,
      setActiveDeck,
      setTheme,
      navigate,
    }
  }, [decks, theme, route, activeDeckId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}

'use client'
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Card, Deck, Route, Theme } from '../lib/types'

type NewCardInput = { deckId: string; front: string; back: string }

type AppApi = {
  decks: Deck[]
  cards: Card[]
  theme: Theme
  route: Route
  selectedDeckId: string | null
  studyIndex: number
  flipped: boolean
  addCard: (input: NewCardInput) => Card
  markKnown: (id: string, known: boolean) => void
  flip: () => void
  nextCard: () => void
  resetDeck: (deckId: string) => void
  studyDeck: (id: string) => void
  startAddCard: (deckId: string) => void
  setTheme: (theme: Theme) => void
  navigate: (route: Route) => void
}

const AppContext = createContext<AppApi | null>(null)

const SEED_DECKS: Deck[] = [
  { id: 'd1', name: 'Spanish' },
  { id: 'd2', name: 'Capitals' },
]

const SEED_CARDS: Card[] = [
  { id: 'c1', deckId: 'd1', front: 'hola', back: 'hello', known: false },
  { id: 'c2', deckId: 'd1', front: 'gato', back: 'cat', known: true },
  { id: 'c3', deckId: 'd2', front: 'France', back: 'Paris', known: false },
  { id: 'c4', deckId: 'd2', front: 'Japan', back: 'Tokyo', known: false },
]

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [decks] = useState<Deck[]>(SEED_DECKS)
  const [cards, setCards] = useState<Card[]>(SEED_CARDS)
  const [theme, setTheme] = useState<Theme>('light')
  const [route, setRoute] = useState<Route>('decks')
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)
  const [studyIndex, setStudyIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [nextId, setNextId] = useState(5)

  const value = useMemo<AppApi>(() => {
    const addCard = (input: NewCardInput): Card => {
      const id = `c${nextId}`
      setNextId((n) => n + 1)
      const card: Card = {
        id,
        deckId: input.deckId,
        front: input.front,
        back: input.back,
        known: false,
      }
      setCards((prev) => [...prev, card])
      return card
    }

    const markKnown = (id: string, known: boolean) => {
      setCards((prev) => prev.map((c) => (c.id === id ? { ...c, known } : c)))
    }

    const flip = () => setFlipped((f) => !f)

    const nextCard = () => {
      const deckCards = cards.filter((c) => c.deckId === selectedDeckId)
      setStudyIndex((i) => Math.min(i + 1, Math.max(deckCards.length - 1, 0)))
      setFlipped(false)
    }

    const resetDeck = (deckId: string) => {
      setCards((prev) => prev.map((c) => (c.deckId === deckId ? { ...c, known: false } : c)))
    }

    const studyDeck = (id: string) => {
      setSelectedDeckId(id)
      setStudyIndex(0)
      setFlipped(false)
      setRoute('study')
    }

    const startAddCard = (deckId: string) => {
      setSelectedDeckId(deckId)
      setRoute('add')
    }

    const navigate = (next: Route) => setRoute(next)

    return {
      decks,
      cards,
      theme,
      route,
      selectedDeckId,
      studyIndex,
      flipped,
      addCard,
      markKnown,
      flip,
      nextCard,
      resetDeck,
      studyDeck,
      startAddCard,
      setTheme,
      navigate,
    }
  }, [decks, cards, theme, route, selectedDeckId, studyIndex, flipped, nextId])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppApi {
  const v = useContext(AppContext)
  if (!v) throw new Error('useApp must be used within an AppStateProvider')
  return v
}

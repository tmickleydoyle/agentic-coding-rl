export type Card = {
  id: string
  deckId: string
  front: string
  back: string
  known: boolean
}

export type Deck = {
  id: string
  name: string
}

export type Route = 'decks' | 'study' | 'add' | 'stats'
export type Theme = 'light' | 'dark'

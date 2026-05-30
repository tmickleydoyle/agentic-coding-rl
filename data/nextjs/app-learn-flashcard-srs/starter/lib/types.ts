export type Grade = 'easy' | 'hard'

export type Card = {
  id: string
  front: string
  back: string
  dueDay: number
  interval: number
}

export type Deck = {
  id: string
  name: string
  cards: Card[]
}

export type Route = 'decks' | 'review' | 'add-card' | 'stats'
export type Theme = 'light' | 'dark'

export const TODAY = 0

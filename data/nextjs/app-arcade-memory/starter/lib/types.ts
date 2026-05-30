export type Card = {
  id: string
  symbol: string
  faceUp: boolean
  matched: boolean
}

export type Game = {
  cards: Card[]
  moves: number
  matches: number
  firstPick: string | null
}

export type Route = 'play' | 'scores' | 'settings' | 'how-to'
export type Theme = 'light' | 'dark'

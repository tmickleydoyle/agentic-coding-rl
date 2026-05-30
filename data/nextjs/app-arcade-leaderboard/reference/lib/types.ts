export type Game = {
  id: string
  name: string
}

export type Score = {
  id: string
  gameId: string
  player: string
  points: number
}

export type Route = 'games' | 'game-detail' | 'submit' | 'rankings'
export type Theme = 'light' | 'dark'

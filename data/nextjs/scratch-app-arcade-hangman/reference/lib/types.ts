export type Status = 'playing' | 'won' | 'lost'

export type HangmanState = {
  word: string
  guessed: string[]
  wrong: number
  maxWrong: number
  status: Status
}

export type Route = 'play' | 'stats' | 'words' | 'how-to'
export type Theme = 'light' | 'dark'

export type Question = {
  id: string
  category: string
  prompt: string
  choices: string[]
  answer: number
}

export type QuizState = {
  questionIds: string[]
  index: number
  score: number
  answers: number[]
  done: boolean
}

export type Route = 'play' | 'results' | 'leaderboard' | 'categories'
export type Theme = 'light' | 'dark'

export type Word = {
  id: string
  term: string
  answer: string
  mastery: number
}

export type VocabList = {
  id: string
  name: string
  words: Word[]
}

export type Route = 'lists' | 'practice' | 'add-word' | 'progress'
export type Theme = 'light' | 'dark'

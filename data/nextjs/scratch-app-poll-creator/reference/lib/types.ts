export interface Poll {
  id: string
  question: string
  options: string[]
}

export interface Vote {
  id: string
  pollId: string
  option: string
}

export type Route = 'home' | 'polls' | 'vote' | 'results'

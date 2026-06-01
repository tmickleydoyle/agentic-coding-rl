export type Option = {
  id: string
  label: string
  votes: number
}

export type Poll = {
  id: string
  question: string
  options: Option[]
  votedOptionId: string | null
}

export type Route = 'polls' | 'poll' | 'create' | 'trending'
export type Theme = 'light' | 'dark'

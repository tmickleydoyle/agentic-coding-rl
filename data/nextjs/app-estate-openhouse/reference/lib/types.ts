export type Visitor = {
  name: string
}

export type Feedback = {
  visitor: string
  rating: number
  note: string
}

export type House = {
  id: string
  address: string
  time: string
  visitors: Visitor[]
  feedback: Feedback[]
}

export type Route = 'schedule' | 'house-detail' | 'register' | 'feedback'
export type Theme = 'light' | 'dark'

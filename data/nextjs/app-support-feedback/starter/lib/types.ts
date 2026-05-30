export type Sentiment = 'positive' | 'neutral' | 'negative'
export type FeedbackStatus = 'new' | 'reviewed' | 'resolved'

export type Feedback = {
  id: string
  author: string
  message: string
  category: string
  sentiment: Sentiment
  status: FeedbackStatus
}

export type Route = 'inbox' | 'item-detail' | 'categories' | 'stats'
export type Theme = 'light' | 'dark'

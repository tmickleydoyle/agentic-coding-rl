export type Card = {
  id: string
  label: string
  last4: string
  frozen: boolean
  limit: number
}

export type Charge = {
  id: string
  cardId: string
  merchant: string
  amount: number
}

export type Route = 'cards' | 'card-detail' | 'transactions' | 'settings'
export type Theme = 'light' | 'dark'

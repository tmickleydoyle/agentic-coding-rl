export type Bill = {
  id: string
  name: string
  amount: number
  dueDay: number
  paid: boolean
  autopay: boolean
}

export type Route = 'bills' | 'bill-detail' | 'add' | 'upcoming'
export type Theme = 'light' | 'dark'

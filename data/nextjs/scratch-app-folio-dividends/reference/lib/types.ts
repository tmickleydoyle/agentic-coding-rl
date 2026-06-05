export type Holding = {
  id: string
  symbol: string
  name: string
  shares: number
  dividendPerShare: number // annual dividend per share
  payMonth: number // 1-12, the month dividends are paid
}

export type Route = 'dashboard' | 'holding-detail' | 'add' | 'calendar'
export type Theme = 'light' | 'dark'

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

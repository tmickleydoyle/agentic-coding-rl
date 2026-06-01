export type Property = {
  id: string
  address: string
  price: number
}

export type Route = 'properties' | 'calculator' | 'compare' | 'saved'
export type Theme = 'light' | 'dark'

export type LoanInput = {
  price: number
  downPayment: number
  rate: number
  termYears: number
}

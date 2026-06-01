export type Item = {
  id: string
  name: string
  aisle: string
  qty: number
  bought: boolean
}

export type AisleGroup = {
  aisle: string
  items: Item[]
}

export type Route = 'list' | 'add' | 'aisles' | 'history'
export type Theme = 'light' | 'dark'

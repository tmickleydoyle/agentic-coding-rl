export type KeyResult = {
  id: string
  title: string
  progress: number
}

export type Objective = {
  id: string
  title: string
  owner: string
  keyResults: KeyResult[]
}

export type Route = 'objectives' | 'objective-detail' | 'add' | 'dashboard'
export type Theme = 'light' | 'dark'

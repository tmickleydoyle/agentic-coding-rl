export type Mood = 'happy' | 'neutral' | 'sad'

export type Entry = {
  id: string
  date: string
  body: string
  mood: Mood
}

export type Route = 'today' | 'entries' | 'new' | 'insights'
export type Theme = 'light' | 'dark'

export const TODAY = '2026-05-29'

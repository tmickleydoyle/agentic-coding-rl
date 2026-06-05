export type Session = {
  id: string
  title: string
  track: string
  slot: string
  speaker: string
}

export type Route = 'schedule' | 'session-detail' | 'my-agenda' | 'speakers'
export type Theme = 'light' | 'dark'

export const SLOTS: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00']

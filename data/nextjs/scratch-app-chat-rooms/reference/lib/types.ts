export type Member = {
  id: string
  name: string
  handle: string
}

export type Message = {
  id: string
  roomId: string
  authorId: string
  text: string
}

export type Room = {
  id: string
  name: string
  topic: string
}

export type Route = 'rooms' | 'room' | 'members' | 'settings'
export type Theme = 'light' | 'dark'

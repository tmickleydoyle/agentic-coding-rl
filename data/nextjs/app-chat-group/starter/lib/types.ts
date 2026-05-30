export type Person = {
  id: string
  name: string
}

export type Group = {
  id: string
  name: string
  adminId: string
  memberIds: string[]
}

export type Route = 'chats' | 'chat-detail' | 'members' | 'create'
export type Theme = 'light' | 'dark'

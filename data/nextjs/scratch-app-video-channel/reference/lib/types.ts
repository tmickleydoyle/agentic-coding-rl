export type Video = {
  id: string
  channelId: string
  title: string
  views: number
  uploaded: number
}

export type Channel = {
  id: string
  name: string
}

export type SortKey = 'views' | 'recent'
export type Route = 'channel' | 'video-detail' | 'uploads' | 'subscriptions'
export type Theme = 'light' | 'dark'

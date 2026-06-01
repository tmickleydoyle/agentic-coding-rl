import type { Channel, SortKey, Video } from './types'
import { seedChannels, seedVideos } from './seed'

// In-memory server store for the API routes. SEPARATE from the client provider state.

let channels: Channel[] = []
let videos: Video[] = []

function seed(): void {
  channels = seedChannels()
  videos = seedVideos()
}

seed()

export function __reset(): void {
  seed()
}

export function listChannels(): Channel[] {
  return channels.slice()
}

export function listVideos(): Video[] {
  return videos.slice()
}

export function findVideo(id: string): Video | undefined {
  return videos.find((v) => v.id === id)
}

export function channelVideos(channelId: string): Video[] {
  return videos.filter((v) => v.channelId === channelId)
}

export function sortVideos(sort: SortKey): Video[] {
  const copy = videos.slice()
  if (sort === 'views') {
    copy.sort((a, b) => b.views - a.views)
  } else {
    copy.sort((a, b) => b.uploaded - a.uploaded)
  }
  return copy
}

export function recordView(id: string): Video | undefined {
  const v = videos.find((x) => x.id === id)
  if (!v) return undefined
  v.views += 1
  return v
}

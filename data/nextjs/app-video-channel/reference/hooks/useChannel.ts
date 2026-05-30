'use client'
import { useApp } from '../components/AppStateProvider'
import type { Channel, SortKey, Video } from '../lib/types'

export function findChannel(channels: Channel[], id: string | null): Channel | undefined {
  if (!id) return undefined
  return channels.find((c) => c.id === id)
}

export function findVideo(videos: Video[], id: string | null): Video | undefined {
  if (!id) return undefined
  return videos.find((v) => v.id === id)
}

export function channelVideos(videos: Video[], channelId: string): Video[] {
  return videos.filter((v) => v.channelId === channelId)
}

export function sortVideos(
  videos: Video[],
  sort: SortKey,
  viewsFor: (id: string) => number,
): Video[] {
  const copy = videos.slice()
  if (sort === 'views') {
    copy.sort((a, b) => viewsFor(b.id) - viewsFor(a.id))
  } else {
    copy.sort((a, b) => b.uploaded - a.uploaded)
  }
  return copy
}

export function useSubscriptions(): Channel[] {
  const { channels, subscribedIds } = useApp()
  const out: Channel[] = []
  subscribedIds.forEach((id) => {
    const channel = channels.find((c) => c.id === id)
    if (channel) out.push(channel)
  })
  return out
}

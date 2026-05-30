'use client'
import { useApp } from '../components/AppStateProvider'
import type { Channel, SortKey, Video } from '../lib/types'

export function findChannel(_channels: Channel[], _id: string | null): Channel | undefined {
  // TODO: look up a channel by id
  return undefined
}

export function findVideo(_videos: Video[], _id: string | null): Video | undefined {
  // TODO: look up a video by id
  return undefined
}

export function channelVideos(_videos: Video[], _channelId: string): Video[] {
  // TODO: filter videos by channel
  return []
}

export function sortVideos(
  _videos: Video[],
  _sort: SortKey,
  _viewsFor: (id: string) => number,
): Video[] {
  // TODO: return a sorted copy by effective views desc or uploaded desc
  return []
}

export function useSubscriptions(): Channel[] {
  // TODO: return subscribed channels
  void useApp
  return []
}

import type { Channel, SortKey, Video } from './types'

// In-memory server store for the API routes, separate from the client Context state.
// TODO: hold module-level `channels` + `videos` (seed via seedChannels()/seedVideos());
// provide __reset() to re-seed. Tests call __reset() in beforeEach for isolation.

export function __reset(): void {
  // TODO: re-seed the store to its initial state
}

export function listChannels(): Channel[] {
  // TODO: return all channels
  return []
}

export function listVideos(): Video[] {
  // TODO: return all videos
  return []
}

export function findVideo(_id: string): Video | undefined {
  // TODO: look up a video by id
  return undefined
}

export function channelVideos(_channelId: string): Video[] {
  // TODO: filter videos by channel
  return []
}

export function sortVideos(_sort: SortKey): Video[] {
  // TODO: return a sorted copy: views desc or uploaded desc
  return []
}

export function recordView(_id: string): Video | undefined {
  // TODO: increment the video's views and return it; undefined if missing
  return undefined
}

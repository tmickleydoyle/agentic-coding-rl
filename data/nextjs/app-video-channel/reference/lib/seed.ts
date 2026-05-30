import type { Channel, Video } from './types'

export function seedChannels(): Channel[] {
  return [
    { id: 'ch1', name: 'CodeCast' },
    { id: 'ch2', name: 'DesignDaily' },
  ]
}

export function seedVideos(): Video[] {
  return [
    { id: 'v1', channelId: 'ch1', title: 'Hooks Explained', views: 120, uploaded: 3 },
    { id: 'v2', channelId: 'ch1', title: 'Context Deep Dive', views: 90, uploaded: 1 },
    { id: 'v3', channelId: 'ch2', title: 'Color Theory', views: 200, uploaded: 2 },
    { id: 'v4', channelId: 'ch2', title: 'Spacing Systems', views: 50, uploaded: 4 },
  ]
}

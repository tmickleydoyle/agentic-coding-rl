'use client'
import type { Video } from '../lib/types'

export default function VideoCard({
  video,
  watched,
  inList,
  onOpen,
}: {
  video: Video
  watched: boolean
  inList: boolean
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`video-${video.id}`}>
      <span data-testid={`video-${video.id}-title`}>{video.title}</span>
      <span data-testid={`video-${video.id}-duration`}>{video.duration}</span>
      {watched ? <span data-testid={`watched-badge-${video.id}`}>Watched</span> : null}
      {inList ? <span data-testid={`watchlist-badge-${video.id}`}>Saved</span> : null}
      <button data-testid={`open-${video.id}`} onClick={() => onOpen(video.id)}>
        Open
      </button>
    </li>
  )
}

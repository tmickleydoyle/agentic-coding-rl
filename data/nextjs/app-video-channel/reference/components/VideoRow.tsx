'use client'
import type { Video } from '../lib/types'

export default function VideoRow({
  video,
  views,
  onOpen,
}: {
  video: Video
  views: number
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`cv-${video.id}`}>
      <span data-testid={`cv-${video.id}-title`}>{video.title}</span>
      <span data-testid={`cv-${video.id}-views`}>{views}</span>
      <button data-testid={`open-${video.id}`} onClick={() => onOpen(video.id)}>
        Open
      </button>
    </li>
  )
}

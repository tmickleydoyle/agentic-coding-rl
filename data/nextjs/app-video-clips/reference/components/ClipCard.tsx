'use client'
import type { Clip } from '../lib/types'

export default function ClipCard({
  clip,
  likes,
  saved,
  onOpen,
}: {
  clip: Clip
  likes: number
  saved: boolean
  onOpen: (id: string) => void
}) {
  return (
    <li data-testid={`clip-${clip.id}`}>
      <span data-testid={`clip-${clip.id}-title`}>{clip.title}</span>
      <span data-testid={`clip-${clip.id}-likes`}>{likes}</span>
      {saved ? <span data-testid={`save-badge-${clip.id}`}>Saved</span> : null}
      <button data-testid={`open-${clip.id}`} onClick={() => onOpen(clip.id)}>
        Open
      </button>
    </li>
  )
}

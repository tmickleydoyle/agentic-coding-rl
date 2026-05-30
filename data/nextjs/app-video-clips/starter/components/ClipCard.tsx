'use client'
import type { Clip } from '../lib/types'

export default function ClipCard(_props: {
  clip: Clip
  likes: number
  saved: boolean
  onOpen: (id: string) => void
}) {
  // TODO: render the clip-<id> row with title, likes, save badge, and open button.
  return null
}

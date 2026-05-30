'use client'
import type { Video } from '../lib/types'

export default function CategoryGroup(_props: {
  category: string
  videos: Video[]
  isWatched: (id: string) => boolean
  inWatchlist: (id: string) => boolean
  onOpen: (id: string) => void
}) {
  // TODO: render a category-<category> section with its label and VideoCards.
  return null
}

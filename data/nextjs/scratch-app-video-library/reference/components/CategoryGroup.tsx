'use client'
import type { Video } from '../lib/types'
import VideoCard from './VideoCard'

export default function CategoryGroup({
  category,
  videos,
  isWatched,
  inWatchlist,
  onOpen,
}: {
  category: string
  videos: Video[]
  isWatched: (id: string) => boolean
  inWatchlist: (id: string) => boolean
  onOpen: (id: string) => void
}) {
  return (
    <section data-testid={`category-${category}`}>
      <h2 data-testid={`category-${category}-label`}>{category}</h2>
      <ul>
        {videos.map((v) => (
          <VideoCard
            key={v.id}
            video={v}
            watched={isWatched(v.id)}
            inList={inWatchlist(v.id)}
            onOpen={onOpen}
          />
        ))}
      </ul>
    </section>
  )
}

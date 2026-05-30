'use client'
import { useApp } from '../../components/AppStateProvider'
import { videosByCategory } from '../../hooks/useLibrary'
import CategoryGroup from '../../components/CategoryGroup'

export default function BrowsePage() {
  const { videos, isWatched, inWatchlist, openVideo } = useApp()
  const groups = videosByCategory(videos)
  return (
    <section data-testid="page-browse">
      <h1>Browse</h1>
      {groups.map((g) => (
        <CategoryGroup
          key={g.category}
          category={g.category}
          videos={g.videos}
          isWatched={isWatched}
          inWatchlist={inWatchlist}
          onOpen={openVideo}
        />
      ))}
    </section>
  )
}

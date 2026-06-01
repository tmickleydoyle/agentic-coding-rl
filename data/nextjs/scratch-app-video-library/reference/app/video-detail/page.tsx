'use client'
import { useApp } from '../../components/AppStateProvider'
import { findVideo } from '../../hooks/useLibrary'

export default function VideoDetailPage() {
  const {
    videos,
    selectedVideoId,
    isWatched,
    inWatchlist,
    markWatched,
    toggleWatchlist,
  } = useApp()
  const video = findVideo(videos, selectedVideoId)

  if (!video) {
    return (
      <section data-testid="page-video-detail">
        <p data-testid="no-video">No video selected.</p>
      </section>
    )
  }

  const watched = isWatched(video.id)
  const saved = inWatchlist(video.id)

  return (
    <section data-testid="page-video-detail">
      <h1 data-testid="detail-title">{video.title}</h1>
      <span data-testid="detail-category">{video.category}</span>
      <span data-testid="detail-duration">{video.duration}</span>
      <button data-testid="watch-btn" onClick={() => markWatched(video.id)}>
        {watched ? 'Watched' : 'Mark watched'}
      </button>
      {watched ? <span data-testid="watched-flag">Watched</span> : null}
      <button data-testid="watchlist-toggle" onClick={() => toggleWatchlist(video.id)}>
        {saved ? 'Remove from watchlist' : 'Add to watchlist'}
      </button>
    </section>
  )
}

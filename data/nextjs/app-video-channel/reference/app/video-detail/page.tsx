'use client'
import { useApp } from '../../components/AppStateProvider'
import { findChannel, findVideo } from '../../hooks/useChannel'

export default function VideoDetailPage() {
  const { channels, videos, selectedVideoId, viewsFor, recordView } = useApp()
  const video = findVideo(videos, selectedVideoId)

  if (!video) {
    return (
      <section data-testid="page-video-detail">
        <p data-testid="no-video">No video selected.</p>
      </section>
    )
  }

  const channel = findChannel(channels, video.channelId)

  return (
    <section data-testid="page-video-detail">
      <h1 data-testid="detail-title">{video.title}</h1>
      <span data-testid="detail-channel">{channel ? channel.name : ''}</span>
      <span data-testid="detail-views">{viewsFor(video.id)}</span>
      <button data-testid="watch-btn" onClick={() => recordView(video.id)}>
        Watch
      </button>
    </section>
  )
}

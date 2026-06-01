'use client'
import { useApp } from '../../components/AppStateProvider'
import { findClip } from '../../hooks/useClips'

export default function ClipDetailPage() {
  const { clips, selectedClipId, isLiked, isSaved, likesFor, toggleLike, toggleSave } =
    useApp()
  const clip = findClip(clips, selectedClipId)

  if (!clip) {
    return (
      <section data-testid="page-clip-detail">
        <p data-testid="no-clip">No clip selected.</p>
      </section>
    )
  }

  const liked = isLiked(clip.id)
  const saved = isSaved(clip.id)

  return (
    <section data-testid="page-clip-detail">
      <h1 data-testid="detail-title">{clip.title}</h1>
      <span data-testid="detail-category">{clip.category}</span>
      <span data-testid="detail-likes">{likesFor(clip.id)}</span>
      <button data-testid="like-toggle" onClick={() => toggleLike(clip.id)}>
        {liked ? 'Unlike' : 'Like'}
      </button>
      {liked ? <span data-testid="liked-flag">Liked</span> : null}
      <button data-testid="save-toggle" onClick={() => toggleSave(clip.id)}>
        {saved ? 'Unsave' : 'Save'}
      </button>
    </section>
  )
}

'use client'
import React, { useState } from 'react'
import { useApp } from '../../components/AppStateProvider'
import { Track, QueueItem } from '../../lib/types'
export function LibraryPage() {
  const { tracks, setTracks, queue, setQueue } = useApp()
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [album, setAlbum] = useState('')
  const [duration, setDuration] = useState('')

  const handleAdd = () => {
    if (!title) return
    const t: Track = { id: `t${Date.now()}`, title, artist, album, duration: parseInt(duration) || 0 }
    setTracks([...tracks, t])
    setTitle(''); setArtist(''); setAlbum(''); setDuration('')
  }

  const addToQueue = (trackId: string) => {
    const item: QueueItem = { id: `q${Date.now()}`, trackId }
    setQueue([...queue, item])
  }

  return (
    <div data-testid="library-page">
      <h1>Library</h1>
      <input data-testid="input-track-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
      <input data-testid="input-track-artist" value={artist} onChange={e => setArtist(e.target.value)} placeholder="Artist" />
      <input data-testid="input-track-album" value={album} onChange={e => setAlbum(e.target.value)} placeholder="Album" />
      <input data-testid="input-track-duration" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration" type="number" />
      <button data-testid="add-track-btn" onClick={handleAdd}>Add Track</button>
      {tracks.map(t => (
        <div key={t.id} data-testid={`track-item-${t.id}`}>
          <span>{t.title}</span><span>{t.artist}</span><span>{t.album}</span><span>{t.duration}</span>
          <button data-testid={`add-queue-${t.id}`} onClick={() => addToQueue(t.id)}>Add to Queue</button>
        </div>
      ))}
    </div>
  )
}

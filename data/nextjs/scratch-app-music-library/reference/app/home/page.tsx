'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
export function HomePage() {
  const { tracks, queue } = useApp()
  const artists = new Set(tracks.map(t => t.artist))
  return (
    <div data-testid="home-page">
      <h1>Music Library</h1>
      <div data-testid="total-tracks">{tracks.length}</div>
      <div data-testid="total-artists">{artists.size}</div>
      <div data-testid="queue-count">{queue.length}</div>
    </div>
  )
}

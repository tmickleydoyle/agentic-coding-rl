'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
export function ArtistsPage() {
  const { tracks } = useApp()
  const artistMap: Record<string, number> = {}
  tracks.forEach(t => { artistMap[t.artist] = (artistMap[t.artist] || 0) + 1 })
  const artistNames = Object.keys(artistMap)
  return (
    <div data-testid="artists-page">
      <h1>Artists</h1>
      {artistNames.map(name => (
        <div key={name} data-testid={`artist-item-${name.replace(/ /g, '-')}`}>
          <span>{name}</span><span>{artistMap[name]} tracks</span>
        </div>
      ))}
    </div>
  )
}

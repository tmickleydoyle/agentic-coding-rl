'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'

export function FavoritesPage() {
  const { recipes } = useApp()
  const favorites = recipes.filter(r => r.favorite)

  return (
    <div data-testid="favorites-page">
      <h1>Favorites</h1>
      {favorites.map(r => (
        <div key={r.id} data-testid={`fav-card-${r.id}`}>
          <div>{r.name}</div>
          <div>{r.description}</div>
        </div>
      ))}
    </div>
  )
}

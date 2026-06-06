'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'

export function HomePage() {
  const { recipes } = useApp()
  const totalRecipes = recipes.length
  const totalFavorites = recipes.filter(r => r.favorite).length
  const recent = recipes.reduce((a, b) => (a.createdAt > b.createdAt ? a : b), recipes[0])

  return (
    <div data-testid="home-page">
      <h1>Recipe Builder</h1>
      <div data-testid="total-recipes">{totalRecipes}</div>
      <div data-testid="total-favorites">{totalFavorites}</div>
      <div data-testid="recent-recipe">{recent?.name ?? ''}</div>
    </div>
  )
}

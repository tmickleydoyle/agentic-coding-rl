'use client'
import React from 'react'
export function HomePage() {
  return (
    <div data-testid="home-page">
      <h1>Recipe Builder</h1>
      <div data-testid="total-recipes">0</div>
      <div data-testid="total-favorites">0</div>
      <div data-testid="recent-recipe"></div>
    </div>
  )
}

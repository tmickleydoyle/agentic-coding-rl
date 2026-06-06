'use client'
import React from 'react'
import { useApp } from '../../components/AppStateProvider'
import { currentValue } from '../../lib/types'
export function CategoriesPage() {
  const { assets } = useApp()
  const catMap: Record<string, { count: number; totalCurrent: number }> = {}
  assets.forEach(a => {
    if (!catMap[a.category]) catMap[a.category] = { count: 0, totalCurrent: 0 }
    catMap[a.category].count++
    catMap[a.category].totalCurrent += currentValue(a)
  })
  const categories = Object.keys(catMap)
  return (
    <div data-testid="categories-page">
      <h1>Categories</h1>
      {categories.map(cat => (
        <div key={cat} data-testid={`cat-${cat.replace(/ /g, '-')}`}>
          <span>{cat}</span>
          <span>{catMap[cat].count} assets</span>
          <span>{Math.round(catMap[cat].totalCurrent * 100) / 100}</span>
        </div>
      ))}
    </div>
  )
}

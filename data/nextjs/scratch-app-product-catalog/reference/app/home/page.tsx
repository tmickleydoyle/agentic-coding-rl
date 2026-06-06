'use client'
import React, { useEffect, useState } from 'react'
import { useApp } from '../../components/AppStateProvider'

interface Stats { totalProducts: number; totalCategories: number; totalReviews: number; avgRating: string }

export function HomePage() {
  const { refresh } = useApp()
  const [stats, setStats] = useState<Stats>({ totalProducts: 0, totalCategories: 0, totalReviews: 0, avgRating: '0.0' })

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/reviews').then(r => r.json()),
    ]).then(([products, categories, reviews]) => {
      const avg = reviews.length ? (reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / reviews.length).toFixed(1) : '0.0'
      setStats({ totalProducts: products.length, totalCategories: categories.length, totalReviews: reviews.length, avgRating: avg })
    })
  }, [refresh])

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Catalog Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#fffaf0', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-products">{stats.totalProducts}</div><div>Products</div></div>
        <div style={{ padding: '1rem', background: '#f0fff4', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-categories">{stats.totalCategories}</div><div>Categories</div></div>
        <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-total-reviews">{stats.totalReviews}</div><div>Reviews</div></div>
        <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: '8px' }}><div style={{ fontSize: '2rem', fontWeight: 'bold' }} data-testid="stat-avg-rating">{stats.avgRating}</div><div>Avg Rating</div></div>
      </div>
    </div>
  )
}

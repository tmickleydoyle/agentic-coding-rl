'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
import { Route } from '../lib/types'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#c05621', color: 'white' }}>
      <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Product Catalog</span>
      <button data-testid="nav-home" onClick={() => navigate('home')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Home</button>
      <button data-testid="nav-products" onClick={() => navigate('products')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Products</button>
      <button data-testid="nav-categories" onClick={() => navigate('categories')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Categories</button>
      <button data-testid="nav-reviews" onClick={() => navigate('reviews')} style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>Reviews</button>
    </nav>
  )
}

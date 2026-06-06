'use client'
import React from 'react'
import { useApp } from './AppStateProvider'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-products" onClick={() => navigate('products')}>Products</button>
      <button data-testid="nav-categories" onClick={() => navigate('categories')}>Categories</button>
      <button data-testid="nav-reviews" onClick={() => navigate('reviews')}>Reviews</button>
    </nav>
  )
}

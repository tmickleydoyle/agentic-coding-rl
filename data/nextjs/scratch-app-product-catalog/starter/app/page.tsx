'use client'
import React from 'react'
import { AppStateProvider, useApp } from '../components/AppStateProvider'
import { NavBar } from '../components/NavBar'
import { HomePage } from './home/page'
import { ProductsPage } from './products/page'
import { CategoriesPage } from './categories/page'
import { ReviewsPage } from './reviews/page'

function Shell() {
  const { route } = useApp()
  const pages: Record<string, React.ReactElement> = {
    home: <HomePage />, products: <ProductsPage />, categories: <CategoriesPage />, reviews: <ReviewsPage />,
  }
  return <div data-theme="light"><NavBar />{pages[route] ?? <HomePage />}</div>
}

export default function App() {
  return <AppStateProvider><Shell /></AppStateProvider>
}

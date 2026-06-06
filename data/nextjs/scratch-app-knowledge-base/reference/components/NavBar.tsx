'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
export function NavBar() {
  const { setRoute } = useApp()
  return <nav><button data-testid="nav-home" onClick={()=>setRoute('home')}>Home</button><button data-testid="nav-articles" onClick={()=>setRoute('articles')}>Articles</button><button data-testid="nav-categories" onClick={()=>setRoute('categories')}>Categories</button><button data-testid="nav-search" onClick={()=>setRoute('search')}>Search</button></nav>
}

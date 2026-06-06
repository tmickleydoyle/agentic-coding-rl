'use client'
import React from 'react'
import { useApp } from './AppStateProvider'
export function NavBar() {
  const { setRoute } = useApp()
  return <nav><button data-testid="nav-home" onClick={()=>setRoute('home')}>Home</button><button data-testid="nav-books" onClick={()=>setRoute('books')}>Books</button><button data-testid="nav-reviews" onClick={()=>setRoute('reviews')}>Reviews</button><button data-testid="nav-members" onClick={()=>setRoute('members')}>Members</button></nav>
}

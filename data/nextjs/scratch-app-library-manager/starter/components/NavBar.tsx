'use client'
import React from 'react'
import { useApp } from './AppStateProvider'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-books" onClick={() => navigate('books')}>Books</button>
      <button data-testid="nav-members" onClick={() => navigate('members')}>Members</button>
      <button data-testid="nav-loans" onClick={() => navigate('loans')}>Loans</button>
    </nav>
  )
}

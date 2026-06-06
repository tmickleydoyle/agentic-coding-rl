'use client'
import React from 'react'
import { useApp } from './AppStateProvider'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-suppliers" onClick={() => navigate('suppliers')}>Suppliers</button>
      <button data-testid="nav-contacts" onClick={() => navigate('contacts')}>Contacts</button>
      <button data-testid="nav-contracts" onClick={() => navigate('contracts')}>Contracts</button>
    </nav>
  )
}

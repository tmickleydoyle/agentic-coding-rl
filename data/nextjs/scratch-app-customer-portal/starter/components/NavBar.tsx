'use client'
import React from 'react'
import { useApp } from './AppStateProvider'

export function NavBar() {
  const { navigate } = useApp()
  return (
    <nav>
      <button data-testid="nav-home" onClick={() => navigate('home')}>Home</button>
      <button data-testid="nav-tickets" onClick={() => navigate('tickets')}>Tickets</button>
      <button data-testid="nav-orders" onClick={() => navigate('orders')}>Orders</button>
      <button data-testid="nav-profile" onClick={() => navigate('profile')}>Profile</button>
    </nav>
  )
}

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Navigation', () => {
  it('renders home by default', () => {
    render(<App />)
    expect(screen.getByTestId('dashboard-task-count')).toBeDefined()
  })
  it('navigates to tasks', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('task-list')).toBeDefined()
  })
  it('navigates to history', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('history-list')).toBeDefined()
  })
  it('navigates to rooms', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-rooms'))
    expect(screen.getByTestId('room-list')).toBeDefined()
  })
  it('navigates back home', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-tasks'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('dashboard-task-count')).toBeDefined()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Music Library Feature', () => {
  it('shows total tracks on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-tracks').textContent).toBe('5')
  })

  it('shows total artists on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-artists').textContent).toBe('3')
  })

  it('shows queue count on home', () => {
    render(<App />)
    expect(screen.getByTestId('queue-count').textContent).toBe('2')
  })

  it('renders all seed tracks on library page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-library'))
    expect(screen.getByTestId('track-item-t1')).toBeTruthy()
    expect(screen.getByTestId('track-item-t5')).toBeTruthy()
  })

  it('adds a new track', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-library'))
    fireEvent.change(screen.getByTestId('input-track-title'), { target: { value: 'Imagine' } })
    fireEvent.change(screen.getByTestId('input-track-artist'), { target: { value: 'John Lennon' } })
    fireEvent.click(screen.getByTestId('add-track-btn'))
    expect(screen.getByText('Imagine')).toBeTruthy()
  })

  it('add to queue from library updates queue count', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-library'))
    fireEvent.click(screen.getByTestId('add-queue-t2'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('queue-count').textContent).toBe('3')
  })

  it('shows artists on artists page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-artists'))
    expect(screen.getByTestId('artist-item-Queen')).toBeTruthy()
    expect(screen.getByTestId('artist-item-David-Bowie')).toBeTruthy()
    expect(screen.getByTestId('artist-item-The-Police')).toBeTruthy()
  })

  it('artist shows correct track count', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-artists'))
    expect(screen.getByTestId('artist-item-Queen').textContent).toContain('2')
  })

  it('queue page shows seed queue items', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('queue-item-q1')).toBeTruthy()
    expect(screen.getByTestId('queue-item-q2')).toBeTruthy()
  })

  it('remove from queue updates home queue count', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-queue'))
    fireEvent.click(screen.getByTestId('remove-queue-q1'))
    fireEvent.click(screen.getByTestId('nav-home'))
    expect(screen.getByTestId('queue-count').textContent).toBe('1')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import App from '../reference/app/page'

describe('Polls Feature', () => {
  it('shows total polls on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-polls').textContent).toBe('3')
  })

  it('shows total votes on home', () => {
    render(<App />)
    expect(screen.getByTestId('total-votes').textContent).toBe('6')
  })

  it('shows popular poll question on home', () => {
    render(<App />)
    const text = screen.getByTestId('popular-poll').textContent
    expect(text).toBeTruthy()
    expect(text!.length).toBeGreaterThan(0)
  })

  it('renders seed polls on polls page', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-polls'))
    expect(screen.getByTestId('poll-item-p1')).toBeTruthy()
    expect(screen.getByTestId('poll-item-p2')).toBeTruthy()
    expect(screen.getByTestId('poll-item-p3')).toBeTruthy()
  })

  it('shows option count on poll item', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-polls'))
    expect(screen.getByTestId('poll-item-p1').textContent).toContain('3 options')
  })

  it('adds a new poll', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-polls'))
    fireEvent.change(screen.getByTestId('input-poll-question'), { target: { value: 'Favorite color?' } })
    fireEvent.change(screen.getByTestId('input-poll-options'), { target: { value: 'Red, Blue, Green' } })
    fireEvent.click(screen.getByTestId('add-poll-btn'))
    expect(screen.getByText('Favorite color?')).toBeTruthy()
  })

  it('vote page shows poll selector', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-vote'))
    expect(screen.getByTestId('poll-select')).toBeTruthy()
  })

  it('selecting poll shows options', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-vote'))
    fireEvent.change(screen.getByTestId('poll-select'), { target: { value: 'p1' } })
    expect(screen.getByTestId('option-Python')).toBeTruthy()
    expect(screen.getByTestId('option-TypeScript')).toBeTruthy()
  })

  it('casting vote shows confirmation', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-vote'))
    fireEvent.change(screen.getByTestId('poll-select'), { target: { value: 'p1' } })
    fireEvent.click(screen.getByTestId('option-Rust'))
    fireEvent.click(screen.getByTestId('cast-vote-btn'))
    expect(screen.getByTestId('vote-confirm')).toBeTruthy()
  })

  it('results page shows poll results', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-results'))
    expect(screen.getByTestId('result-poll-p1')).toBeTruthy()
    expect(screen.getByTestId('result-option-p1-TypeScript')).toBeTruthy()
  })

  it('results show correct vote count', () => {
    render(<App />)
    fireEvent.click(screen.getByTestId('nav-results'))
    // TypeScript has 2 votes in p1
    expect(screen.getByTestId('result-option-p1-TypeScript').textContent).toContain('2')
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Chord Chart', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByText('Chord Chart')).toBeTruthy()
  })

  it('shows all 8 seed chords initially', () => {
    expect(screen.getByTestId('visible-count').textContent).toBe('8')
  })

  it('shows chord cards for seed data', () => {
    expect(screen.getByTestId('chord-card-1')).toBeTruthy()
    expect(screen.getByTestId('chord-card-8')).toBeTruthy()
  })

  it('shows chord name in card', () => {
    expect(within(screen.getByTestId('chord-card-1')).getByTestId('chord-name-1').textContent).toBe('C Major')
  })

  it('shows chord notes in card', () => {
    expect(within(screen.getByTestId('chord-card-1')).getByTestId('chord-notes-1').textContent).toBe('C E G')
  })

  it('initial favorite count is 0', () => {
    expect(screen.getByTestId('favorite-count').textContent).toBe('0')
  })

  it('favorite button toggles to Unfavorite', async () => {
    const user = userEvent.setup()
    const btn = screen.getByTestId('favorite-btn-1')
    expect(btn.textContent).toBe('Favorite')
    await user.click(btn)
    expect(screen.getByTestId('favorite-btn-1').textContent).toBe('Unfavorite')
  })

  it('favorite count updates on toggle', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('favorite-btn-1'))
    await user.click(screen.getByTestId('favorite-btn-2'))
    expect(screen.getByTestId('favorite-count').textContent).toBe('2')
  })

  it('filter by key C shows only C chords', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-key'), 'C')
    // C Major (id1) and Cmaj7 (id8)
    expect(screen.getByTestId('chord-card-1')).toBeTruthy()
    expect(screen.getByTestId('chord-card-8')).toBeTruthy()
    expect(screen.queryByTestId('chord-card-2')).toBeNull()
    expect(screen.getByTestId('visible-count').textContent).toBe('2')
  })

  it('filter by difficulty intermediate', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-difficulty'), 'intermediate')
    // F Major (4), B7 (7), Cmaj7 (8)
    expect(screen.getByTestId('visible-count').textContent).toBe('3')
  })

  it('combined key and difficulty filter', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByTestId('filter-key'), 'C')
    await user.selectOptions(screen.getByTestId('filter-difficulty'), 'intermediate')
    // Only Cmaj7 (id8)
    expect(screen.getByTestId('visible-count').textContent).toBe('1')
    expect(screen.getByTestId('chord-card-8')).toBeTruthy()
  })

  it('adds a new chord', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-name'), 'A7')
    await user.type(screen.getByTestId('input-key'), 'A')
    await user.type(screen.getByTestId('input-type'), 'Dominant')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('visible-count').textContent).toBe('9')
  })

  it('does not add chord with empty name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('input-key'), 'A')
    await user.click(screen.getByTestId('btn-add'))
    expect(screen.getByTestId('visible-count').textContent).toBe('8')
  })

  it('favorite count not affected by filters', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('favorite-btn-1'))
    await user.selectOptions(screen.getByTestId('filter-key'), 'G')
    expect(screen.getByTestId('favorite-count').textContent).toBe('1')
  })
})

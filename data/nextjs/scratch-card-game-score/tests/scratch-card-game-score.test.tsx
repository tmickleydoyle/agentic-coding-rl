import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Card Game Score Tracker', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /card game score tracker/i })).toBeTruthy()
  })

  it('shows 2 rounds played on load', () => {
    expect(screen.getByTestId('round-count').textContent).toBe('2 rounds played')
  })

  it('shows current round as Round 3', () => {
    expect(screen.getByTestId('current-round').textContent).toBe('Round 3')
  })

  it('renders 3 player rows', () => {
    expect(screen.getAllByTestId('player-row').length).toBe(3)
  })

  it('shows Alice total as 37', () => {
    const rows = screen.getAllByTestId('player-row')
    const aliceRow = rows.find(r => within(r).getByTestId('player-name').textContent === 'Alice')!
    expect(within(aliceRow).getByTestId('player-total').textContent).toBe('37')
  })

  it('shows Bob total as 28', () => {
    const rows = screen.getAllByTestId('player-row')
    const bobRow = rows.find(r => within(r).getByTestId('player-name').textContent === 'Bob')!
    expect(within(bobRow).getByTestId('player-total').textContent).toBe('28')
  })

  it('Alice is the leader on load', () => {
    const rows = screen.getAllByTestId('player-row')
    const aliceRow = rows.find(r => within(r).getByTestId('player-name').textContent === 'Alice')!
    expect(within(aliceRow).getByTestId('leader-badge')).toBeTruthy()
  })

  it('Bob does not have leader badge on load', () => {
    const rows = screen.getAllByTestId('player-row')
    const bobRow = rows.find(r => within(r).getByTestId('player-name').textContent === 'Bob')!
    expect(within(bobRow).queryByTestId('leader-badge')).toBeNull()
  })

  it('adds a round with valid scores', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Alice score'), '10')
    await user.type(screen.getByLabelText('Bob score'), '20')
    await user.type(screen.getByLabelText('Carol score'), '15')
    await user.click(screen.getByRole('button', { name: /add round/i }))
    expect(screen.getByTestId('round-count').textContent).toBe('3 rounds played')
    expect(screen.getByTestId('current-round').textContent).toBe('Round 4')
  })

  it('shows error when submitting with empty scores', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add round/i }))
    expect(screen.getByTestId('score-error').textContent).toMatch(/please enter valid scores for all players/i)
  })

  it('does not add round on invalid input', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add round/i }))
    expect(screen.getByTestId('round-count').textContent).toBe('2 rounds played')
  })

  it('accepts negative scores', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Alice score'), '-5')
    await user.type(screen.getByLabelText('Bob score'), '-3')
    await user.type(screen.getByLabelText('Carol score'), '-10')
    await user.click(screen.getByRole('button', { name: /add round/i }))
    expect(screen.getByTestId('round-count').textContent).toBe('3 rounds played')
  })

  it('reset restores seed totals', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Alice score'), '100')
    await user.type(screen.getByLabelText('Bob score'), '100')
    await user.type(screen.getByLabelText('Carol score'), '100')
    await user.click(screen.getByRole('button', { name: /add round/i }))
    await user.click(screen.getByTestId('reset-btn'))
    expect(screen.getByTestId('round-count').textContent).toBe('2 rounds played')
    const rows = screen.getAllByTestId('player-row')
    const aliceRow = rows.find(r => within(r).getByTestId('player-name').textContent === 'Alice')!
    expect(within(aliceRow).getByTestId('player-total').textContent).toBe('37')
  })
})

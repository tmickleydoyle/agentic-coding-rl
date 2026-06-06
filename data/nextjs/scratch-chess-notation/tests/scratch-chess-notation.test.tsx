import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Chess Notation Recorder', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /chess notation recorder/i })).toBeTruthy()
  })

  it('shows 4 half-moves on load', () => {
    expect(screen.getByTestId('move-count').textContent).toBe('4 moves')
  })

  it('shows White to move initially (4 half-moves = even)', () => {
    expect(screen.getByTestId('current-turn').textContent).toBe('White to move')
  })

  it('renders 2 move rows for seed data', () => {
    expect(screen.getAllByTestId('move-row').length).toBe(2)
  })

  it('first row shows move number 1', () => {
    const rows = screen.getAllByTestId('move-row')
    expect(rows[0].querySelector('[data-testid="move-number"]')!.textContent).toBe('1.')
  })

  it('first row shows white move e4', () => {
    const rows = screen.getAllByTestId('move-row')
    expect(rows[0].querySelector('[data-testid="move-white"]')!.textContent).toBe('e4')
  })

  it('adds a white move and switches to black', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/enter move/i), 'd4')
    await user.click(screen.getByRole('button', { name: /add move/i }))
    expect(screen.getByTestId('move-count').textContent).toBe('5 moves')
    expect(screen.getByTestId('current-turn').textContent).toBe('Black to move')
  })

  it('shows error when submitting empty move', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add move/i }))
    expect(screen.getByTestId('move-error').textContent).toMatch(/move cannot be empty/i)
  })

  it('empty move does not advance turn', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add move/i }))
    expect(screen.getByTestId('move-count').textContent).toBe('4 moves')
  })

  it('undo removes last half-move', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('undo-btn'))
    expect(screen.getByTestId('move-count').textContent).toBe('3 moves')
    expect(screen.getByTestId('current-turn').textContent).toBe('Black to move')
  })

  it('undo button is disabled when no moves remain', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('clear-btn'))
    expect(screen.getByTestId('undo-btn')).toHaveProperty('disabled', true)
  })

  it('clear all resets to 0 moves and White to move', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('clear-btn'))
    expect(screen.getByTestId('move-count').textContent).toBe('0 moves')
    expect(screen.getByTestId('current-turn').textContent).toBe('White to move')
  })

  it('after clear all, no move rows displayed', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('clear-btn'))
    expect(screen.queryAllByTestId('move-row').length).toBe(0)
  })

  it('adding white move then black creates a full row', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('clear-btn'))
    await user.type(screen.getByLabelText(/enter move/i), 'e4')
    await user.click(screen.getByRole('button', { name: /add move/i }))
    await user.type(screen.getByLabelText(/enter move/i), 'e5')
    await user.click(screen.getByRole('button', { name: /add move/i }))
    const rows = screen.getAllByTestId('move-row')
    expect(rows.length).toBe(1)
    expect(rows[0].querySelector('[data-testid="move-white"]')!.textContent).toBe('e4')
    expect(rows[0].querySelector('[data-testid="move-black"]')!.textContent).toBe('e5')
  })
})

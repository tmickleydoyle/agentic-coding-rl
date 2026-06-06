import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('High Score Table', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /high score table/i })).toBeTruthy()
  })

  it('shows 5 scores on load', () => {
    expect(screen.getByTestId('score-count').textContent).toBe('5 scores')
  })

  it('renders 5 score rows', () => {
    expect(screen.getAllByTestId('score-row').length).toBe(5)
  })

  it('first row is rank #1 (Alice, 9500)', () => {
    const rows = screen.getAllByTestId('score-row')
    expect(within(rows[0]).getByTestId('score-rank').textContent).toBe('#1')
    expect(within(rows[0]).getByTestId('score-player').textContent).toBe('Alice')
    expect(within(rows[0]).getByTestId('score-value').textContent).toBe('9500')
  })

  it('Alice has TOP badge', () => {
    const rows = screen.getAllByTestId('score-row')
    expect(within(rows[0]).getByTestId('top-badge')).toBeTruthy()
  })

  it('second rank does not have TOP badge', () => {
    const rows = screen.getAllByTestId('score-row')
    expect(within(rows[1]).queryByTestId('top-badge')).toBeNull()
  })

  it('adds a score and it appears in sorted position', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/player name/i), 'Zara')
    await user.type(screen.getByLabelText(/score/i), '10000')
    await user.type(screen.getByLabelText(/game/i), 'SpaceRun')
    await user.click(screen.getByRole('button', { name: /add score/i }))
    expect(screen.getByTestId('score-count').textContent).toBe('6 scores')
    const rows = screen.getAllByTestId('score-row')
    expect(within(rows[0]).getByTestId('score-player').textContent).toBe('Zara')
    expect(within(rows[0]).getByTestId('top-badge')).toBeTruthy()
  })

  it('shows error when player name is empty', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/score/i), '1000')
    await user.type(screen.getByLabelText(/game/i), 'Test')
    await user.click(screen.getByRole('button', { name: /add score/i }))
    expect(screen.getByTestId('score-error').textContent).toMatch(/please fill all fields with valid data/i)
  })

  it('shows error for negative score', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/player name/i), 'Neg')
    await user.type(screen.getByLabelText(/score/i), '-1')
    await user.type(screen.getByLabelText(/game/i), 'Test')
    await user.click(screen.getByRole('button', { name: /add score/i }))
    expect(screen.getByTestId('score-error')).toBeTruthy()
    expect(screen.getByTestId('score-count').textContent).toBe('5 scores')
  })

  it('accepts score of 0', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/player name/i), 'Zero')
    await user.type(screen.getByLabelText(/score/i), '0')
    await user.type(screen.getByLabelText(/game/i), 'Test')
    await user.click(screen.getByRole('button', { name: /add score/i }))
    expect(screen.getByTestId('score-count').textContent).toBe('6 scores')
  })

  it('search filters by player name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'alice')
    expect(screen.getByTestId('score-count').textContent).toBe('1 scores')
    const rows = screen.getAllByTestId('score-row')
    expect(within(rows[0]).getByTestId('score-player').textContent).toBe('Alice')
  })

  it('search with no match shows 0 scores', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('search-input'), 'zzznomatch')
    expect(screen.getByTestId('score-count').textContent).toBe('0 scores')
  })

  it('removes a score entry', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('remove-score')[0])
    expect(screen.getByTestId('score-count').textContent).toBe('4 scores')
  })

  it('after deleting rank 1, new top gets TOP badge', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('remove-score')[0])
    const rows = screen.getAllByTestId('score-row')
    expect(within(rows[0]).getByTestId('top-badge')).toBeTruthy()
    expect(within(rows[0]).getByTestId('score-rank').textContent).toBe('#1')
  })
})

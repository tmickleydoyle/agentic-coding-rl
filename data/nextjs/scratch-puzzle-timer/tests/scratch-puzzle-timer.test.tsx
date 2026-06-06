import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Puzzle Timer', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /puzzle timer/i })).toBeTruthy()
  })

  it('shows 4 attempts on load', () => {
    expect(screen.getByTestId('attempt-count').textContent).toBe('4 attempts')
  })

  it('renders 4 attempt items', () => {
    expect(screen.getAllByTestId('attempt-item').length).toBe(4)
  })

  it('attempts are sorted by time ascending', () => {
    const times = screen.getAllByTestId('attempt-time').map(el => el.textContent)
    expect(times[0]).toBe('95s')
    expect(times[1]).toBe('120s')
  })

  it('shows Best badge for fastest Sudoku Easy (95s)', () => {
    const items = screen.getAllByTestId('attempt-item')
    const fastestSudoku = items.find(i =>
      within(i).getByTestId('attempt-time').textContent === '95s'
    )!
    expect(within(fastestSudoku).getByTestId('best-badge')).toBeTruthy()
  })

  it('does not show Best badge for slower Sudoku Easy (120s)', () => {
    const items = screen.getAllByTestId('attempt-item')
    const slowerSudoku = items.find(i =>
      within(i).getByTestId('attempt-time').textContent === '120s'
    )!
    expect(within(slowerSudoku).queryByTestId('best-badge')).toBeNull()
  })

  it('adds a new attempt', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/puzzle name/i), 'Jigsaw')
    await user.type(screen.getByLabelText(/time \(seconds\)/i), '200')
    await user.click(screen.getByRole('button', { name: /log attempt/i }))
    expect(screen.getByTestId('attempt-count').textContent).toBe('5 attempts')
  })

  it('shows error for empty puzzle name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/time \(seconds\)/i), '60')
    await user.click(screen.getByRole('button', { name: /log attempt/i }))
    expect(screen.getByTestId('attempt-error').textContent).toMatch(/please enter a valid puzzle name and time/i)
  })

  it('shows error for time = 0', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/puzzle name/i), 'Test')
    await user.type(screen.getByLabelText(/time \(seconds\)/i), '0')
    await user.click(screen.getByRole('button', { name: /log attempt/i }))
    expect(screen.getByTestId('attempt-error')).toBeTruthy()
    expect(screen.getByTestId('attempt-count').textContent).toBe('4 attempts')
  })

  it('filter easy shows only easy attempts', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-easy'))
    const items = screen.getAllByTestId('attempt-item')
    items.forEach(item => {
      expect(within(item).getByTestId('attempt-difficulty').textContent).toBe('easy')
    })
  })

  it('filter hard shows only hard attempts', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-hard'))
    expect(screen.getByTestId('attempt-count').textContent).toBe('1 attempts')
  })

  it('filter all button is active by default', () => {
    expect(screen.getByTestId('filter-all').getAttribute('aria-pressed')).toBe('true')
  })

  it('filter easy button becomes active when clicked', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByTestId('filter-easy'))
    expect(screen.getByTestId('filter-easy').getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByTestId('filter-all').getAttribute('aria-pressed')).toBe('false')
  })

  it('deletes an attempt', async () => {
    const user = userEvent.setup()
    await user.click(screen.getAllByTestId('delete-attempt')[0])
    expect(screen.getByTestId('attempt-count').textContent).toBe('3 attempts')
  })
})

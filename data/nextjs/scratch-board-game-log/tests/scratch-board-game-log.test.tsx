import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Board Game Log', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders the heading', () => {
    expect(screen.getByRole('heading', { name: /board game log/i })).toBeTruthy()
  })

  it('shows 3 seed sessions on load', () => {
    expect(screen.getByTestId('session-count').textContent).toBe('3 sessions')
  })

  it('renders session-item elements for each seed session', () => {
    expect(screen.getAllByTestId('session-item').length).toBe(3)
  })

  it('displays game names in session items', () => {
    const games = screen.getAllByTestId('session-game').map(el => el.textContent)
    expect(games).toContain('Catan')
    expect(games).toContain('Chess')
  })

  it('displays winner in each session item', () => {
    const winners = screen.getAllByTestId('session-winner').map(el => el.textContent)
    expect(winners).toContain('Alice')
  })

  it('displays duration with "min" suffix', () => {
    const durations = screen.getAllByTestId('session-duration').map(el => el.textContent)
    expect(durations.some(d => d === '90 min')).toBe(true)
  })

  it('adds a new session with valid inputs', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/game name/i), 'Monopoly')
    await user.type(screen.getByLabelText(/players \(comma-separated\)/i), 'Gina, Hank')
    await user.type(screen.getByLabelText(/winner/i), 'Gina')
    await user.type(screen.getByLabelText(/duration/i), '60')
    await user.click(screen.getByRole('button', { name: /add session/i }))
    expect(screen.getByTestId('session-count').textContent).toBe('4 sessions')
    const games = screen.getAllByTestId('session-game').map(el => el.textContent)
    expect(games).toContain('Monopoly')
  })

  it('shows error when submitting incomplete form', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add session/i }))
    expect(screen.getByTestId('form-error').textContent).toMatch(/please fill all fields correctly/i)
  })

  it('does not add session with duration 0', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/game name/i), 'Risk')
    await user.type(screen.getByLabelText(/players \(comma-separated\)/i), 'A, B')
    await user.type(screen.getByLabelText(/winner/i), 'A')
    await user.type(screen.getByLabelText(/duration/i), '0')
    await user.click(screen.getByRole('button', { name: /add session/i }))
    expect(screen.getByTestId('session-count').textContent).toBe('3 sessions')
    expect(screen.getByTestId('form-error')).toBeTruthy()
  })

  it('filters sessions by game name', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'chess')
    expect(screen.getByTestId('session-count').textContent).toBe('1 sessions')
    expect(screen.getAllByTestId('session-item').length).toBe(1)
  })

  it('filter shows 0 sessions when no match', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByTestId('filter-input'), 'zzznomatch')
    expect(screen.getByTestId('session-count').textContent).toBe('0 sessions')
  })

  it('sort by duration button toggles aria-pressed', async () => {
    const user = userEvent.setup()
    const btn = screen.getByTestId('sort-duration')
    expect(btn.getAttribute('aria-pressed')).toBe('false')
    await user.click(btn)
    expect(btn.getAttribute('aria-pressed')).toBe('true')
  })

  it('sort by date button is active by default', () => {
    expect(screen.getByTestId('sort-date').getAttribute('aria-pressed')).toBe('true')
  })

  it('deletes a session when Delete clicked', async () => {
    const user = userEvent.setup()
    const deleteButtons = screen.getAllByTestId('delete-session')
    await user.click(deleteButtons[0])
    expect(screen.getByTestId('session-count').textContent).toBe('2 sessions')
  })
})

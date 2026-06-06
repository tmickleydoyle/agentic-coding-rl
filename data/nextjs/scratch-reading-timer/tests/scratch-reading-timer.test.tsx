import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Reading Timer App', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /reading timer/i })).toBeInTheDocument()
  })

  it('shows 2 seed log entries', () => {
    render(<App />)
    expect(screen.getAllByTestId('log-item')).toHaveLength(2)
  })

  it('shows correct initial total', () => {
    render(<App />)
    expect(screen.getByTestId('total-minutes').textContent).toBe('Total: 75 min')
  })

  it('active session panel is hidden initially', () => {
    render(<App />)
    expect(screen.queryByTestId('active-session')).toBeNull()
  })

  it('starts a session and shows active panel', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.type(screen.getByLabelText(/book title/i), 'Neuromancer')
    await user.clear(screen.getByLabelText(/minutes/i))
    await user.type(screen.getByLabelText(/minutes/i), '25')
    await user.click(screen.getByRole('button', { name: /start session/i }))
    expect(screen.getByTestId('active-session')).toBeInTheDocument()
    expect(screen.getByTestId('session-book').textContent).toBe('Neuromancer')
    expect(screen.getByTestId('timer-display').textContent).toBe('25:00')
  })

  it('disables form inputs during session', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.type(screen.getByLabelText(/book title/i), 'Dune')
    await user.type(screen.getByLabelText(/minutes/i), '10')
    await user.click(screen.getByRole('button', { name: /start session/i }))
    expect(screen.getByLabelText(/book title/i)).toBeDisabled()
    expect(screen.getByRole('button', { name: /start session/i })).toBeDisabled()
  })

  it('clears form fields after starting session', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.type(screen.getByLabelText(/book title/i), 'Hyperion')
    await user.type(screen.getByLabelText(/minutes/i), '20')
    await user.click(screen.getByRole('button', { name: /start session/i }))
    expect(screen.getByLabelText(/book title/i)).toHaveValue('')
  })

  it('finish early logs entry and hides panel', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.type(screen.getByLabelText(/book title/i), 'Snow Crash')
    await user.type(screen.getByLabelText(/minutes/i), '15')
    await user.click(screen.getByRole('button', { name: /start session/i }))
    await user.click(screen.getByRole('button', { name: /finish early/i }))
    expect(screen.queryByTestId('active-session')).toBeNull()
    expect(screen.getAllByTestId('log-item')).toHaveLength(3)
    const books = screen.getAllByTestId('log-book').map(el => el.textContent)
    expect(books).toContain('Snow Crash')
  })

  it('logs original minutes on finish early', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.type(screen.getByLabelText(/book title/i), 'Snow Crash')
    await user.type(screen.getByLabelText(/minutes/i), '15')
    await user.click(screen.getByRole('button', { name: /start session/i }))
    await user.click(screen.getByRole('button', { name: /finish early/i }))
    const items = screen.getAllByTestId('log-item')
    const last = items[items.length - 1]
    expect(within(last).getByTestId('log-minutes').textContent).toBe('15 min')
  })

  it('does not start session with empty title', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.type(screen.getByLabelText(/minutes/i), '10')
    await user.click(screen.getByRole('button', { name: /start session/i }))
    expect(screen.queryByTestId('active-session')).toBeNull()
  })

  it('deletes a log entry and updates total', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    const items = screen.getAllByTestId('log-item')
    await user.click(within(items[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getAllByTestId('log-item')).toHaveLength(1)
    expect(screen.getByTestId('total-minutes').textContent).toBe('Total: 45 min')
  })

  it('timer counts down', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.type(screen.getByLabelText(/book title/i), 'Test Book')
    await user.type(screen.getByLabelText(/minutes/i), '1')
    await user.click(screen.getByRole('button', { name: /start session/i }))
    expect(screen.getByTestId('timer-display').textContent).toBe('01:00')
    act(() => { vi.advanceTimersByTime(5000) })
    expect(screen.getByTestId('timer-display').textContent).toBe('00:55')
  })
})

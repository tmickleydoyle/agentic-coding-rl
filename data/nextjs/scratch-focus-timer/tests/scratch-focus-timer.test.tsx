import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Focus Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /focus timer/i })).toBeInTheDocument()
  })

  it('shows default timer display of 25:00', () => {
    render(<App />)
    expect(screen.getByTestId('timer-display').textContent).toBe('25:00')
  })

  it('shows Ready status initially', () => {
    render(<App />)
    expect(screen.getByTestId('session-status').textContent).toBe('Ready')
  })

  it('shows 0 sessions initially', () => {
    render(<App />)
    expect(screen.getByTestId('session-count').textContent).toBe('Sessions: 0')
  })

  it('clicking 10 min preset changes display to 10:00', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /10 min/i }))
    expect(screen.getByTestId('timer-display').textContent).toBe('10:00')
  })

  it('clicking 5 min preset changes display to 05:00', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /5 min/i }))
    expect(screen.getByTestId('timer-display').textContent).toBe('05:00')
  })

  it('Start button changes to Pause when running', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /start/i }))
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('shows Running status when started', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /start/i }))
    expect(screen.getByTestId('session-status').textContent).toBe('Running')
  })

  it('timer decrements after 1 second', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(1000) })
    expect(screen.getByTestId('timer-display').textContent).toBe('24:59')
  })

  it('reset restores timer display', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(5000) })
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('timer-display').textContent).toBe('25:00')
  })

  it('set custom duration updates display', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.type(screen.getByLabelText(/custom minutes/i), '15')
    await user.click(screen.getByRole('button', { name: /set custom/i }))
    expect(screen.getByTestId('timer-display').textContent).toBe('15:00')
  })

  it('session log entry added on completion', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /5 min/i }))
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(5 * 60 * 1000) })
    expect(screen.getAllByTestId('session-log-item')).toHaveLength(1)
    expect(screen.getByTestId('session-count').textContent).toBe('Sessions: 1')
  })

  it('log entry shows correct duration', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /5 min/i }))
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(5 * 60 * 1000) })
    expect(screen.getByTestId('session-log-item').textContent).toBe('5 min session')
  })

  it('clear log removes entries', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /5 min/i }))
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(5 * 60 * 1000) })
    await user.click(screen.getByRole('button', { name: /clear log/i }))
    expect(screen.queryAllByTestId('session-log-item')).toHaveLength(0)
    expect(screen.getByTestId('session-count').textContent).toBe('Sessions: 0')
  })
})

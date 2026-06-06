import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Pomodoro Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    render(<App />)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows initial timer display as 25:00', () => {
    expect(screen.getByTestId('timer-display')).toHaveTextContent('25:00')
  })

  it('shows initial mode as Work', () => {
    expect(screen.getByTestId('current-mode')).toHaveTextContent('Work')
  })

  it('shows pomodoro count starting at 0', () => {
    expect(screen.getByTestId('pomodoro-count')).toHaveTextContent('Pomodoros: 0')
  })

  it('Start button changes to Pause when clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.click(screen.getByRole('button', { name: /start/i }))
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
  })

  it('timer counts down after Start', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(3000) })
    expect(screen.getByTestId('timer-display')).toHaveTextContent('24:57')
  })

  it('timer pauses when Pause is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(5000) })
    await user.click(screen.getByRole('button', { name: /pause/i }))
    act(() => { vi.advanceTimersByTime(5000) })
    // should still be at 24:55
    expect(screen.getByTestId('timer-display')).toHaveTextContent('24:55')
  })

  it('Reset restores timer to current mode duration', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(10000) })
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('timer-display')).toHaveTextContent('25:00')
  })

  it('switching to Short Break shows 05:00', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.click(screen.getByRole('button', { name: /short break/i }))
    expect(screen.getByTestId('timer-display')).toHaveTextContent('05:00')
    expect(screen.getByTestId('current-mode')).toHaveTextContent('Short Break')
  })

  it('switching to Long Break shows 15:00', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.click(screen.getByRole('button', { name: /long break/i }))
    expect(screen.getByTestId('timer-display')).toHaveTextContent('15:00')
  })

  it('increments pomodoro count when Work timer reaches 00:00', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(1500 * 1000) })
    expect(screen.getByTestId('timer-display')).toHaveTextContent('00:00')
    expect(screen.getByTestId('pomodoro-count')).toHaveTextContent('Pomodoros: 1')
  })

  it('does not increment pomodoro count for Short Break completion', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.click(screen.getByRole('button', { name: /short break/i }))
    await user.click(screen.getByRole('button', { name: /start/i }))
    act(() => { vi.advanceTimersByTime(300 * 1000) })
    expect(screen.getByTestId('pomodoro-count')).toHaveTextContent('Pomodoros: 0')
  })

  it('adds a task', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.type(screen.getByLabelText(/new task/i), 'Write tests')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getAllByTestId('task-row')).toHaveLength(1)
    expect(screen.getByText('Write tests')).toBeInTheDocument()
  })

  it('does not add empty task', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.queryAllByTestId('task-row')).toHaveLength(0)
  })

  it('marks a task as done', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.type(screen.getByLabelText(/new task/i), 'Read docs')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    const row = screen.getByTestId('task-row')
    await user.click(within(row).getByRole('checkbox'))
    expect(row).toHaveAttribute('data-done', 'true')
  })

  it('removes a task', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    await user.type(screen.getByLabelText(/new task/i), 'Delete me')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    await user.click(within(screen.getByTestId('task-row')).getByRole('button', { name: /remove/i }))
    expect(screen.queryAllByTestId('task-row')).toHaveLength(0)
  })
})

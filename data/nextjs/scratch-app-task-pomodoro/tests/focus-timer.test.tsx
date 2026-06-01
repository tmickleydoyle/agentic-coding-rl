import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import App from '../app/page'
import { SESSION_SECONDS } from '../lib/types'

// These tests use fake timers to drive the countdown. We click with fireEvent (sync) so
// the clicks don't depend on real timers, and advance the clock inside act(...).

function click(testid: string) {
  fireEvent.click(screen.getByTestId(testid))
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

describe('focus timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows the selected task and the full session time initially', () => {
    render(<App />)
    click('nav-focus')
    expect(screen.getByTestId('focus-task')).toHaveTextContent('Write report')
    expect(screen.getByTestId('remaining')).toHaveTextContent(String(SESSION_SECONDS))
  })

  it('counts down one second per second while running', () => {
    render(<App />)
    click('nav-focus')
    click('start-timer')
    advance(3000)
    expect(screen.getByTestId('remaining')).toHaveTextContent(String(SESSION_SECONDS - 3))
  })

  it('pause stops the countdown', () => {
    render(<App />)
    click('nav-focus')
    click('start-timer')
    advance(2000)
    click('pause-timer')
    advance(5000)
    expect(screen.getByTestId('remaining')).toHaveTextContent(String(SESSION_SECONDS - 2))
  })

  it('reset restores the full time', () => {
    render(<App />)
    click('nav-focus')
    click('start-timer')
    advance(4000)
    click('reset-timer')
    expect(screen.getByTestId('remaining')).toHaveTextContent(String(SESSION_SECONDS))
  })

  it('completing the countdown increments the task session count and resets', () => {
    render(<App />)
    // t1 starts with 2 sessions and is the selected task
    click('nav-focus')
    click('start-timer')
    advance(SESSION_SECONDS * 1000)
    // the timer hit 0 — it resets back to the full duration
    expect(screen.getByTestId('remaining')).toHaveTextContent(String(SESSION_SECONDS))
    click('nav-tasks')
    expect(screen.getByTestId('session-count-t1')).toHaveTextContent('3')
  })

  it('a completed session shows up in the stats total', () => {
    render(<App />)
    click('nav-focus')
    click('start-timer')
    advance(SESSION_SECONDS * 1000)
    click('nav-stats')
    // seed total is 2 + 0 + 1 = 3, plus one new session = 4
    expect(screen.getByTestId('total-sessions')).toHaveTextContent('4')
  })

  it('shows a no-task message when nothing is selected', () => {
    render(<App />)
    // remove the selected task t1 -> selection clears
    click('remove-t1')
    click('nav-focus')
    expect(screen.getByTestId('no-task')).toBeInTheDocument()
    expect(screen.queryByTestId('focus-task')).not.toBeInTheDocument()
  })
})

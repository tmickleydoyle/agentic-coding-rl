import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import App from '../app/page'

// Uses fake timers to drive the mismatch hide-delay. fireEvent (synchronous) avoids the
// userEvent/fake-timer interplay; act() flushes React updates.

const click = (testId: string) => {
  act(() => {
    fireEvent.click(screen.getByTestId(testId))
  })
}

describe('play flow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('flips a card face up on the first pick', () => {
    render(<App />)
    click('card-c0')
    expect(screen.getByTestId('card-c0')).toHaveTextContent('A')
    expect(screen.getByTestId('card-c0')).toBeDisabled()
  })

  it('matches a pair and counts a move + match', () => {
    render(<App />)
    click('card-c0') // A
    click('card-c4') // A
    expect(screen.getByTestId('moves')).toHaveTextContent('1')
    expect(screen.getByTestId('matches')).toHaveTextContent('1')
    expect(screen.getByTestId('card-c0')).toHaveTextContent('A')
    expect(screen.getByTestId('card-c4')).toHaveTextContent('A')
  })

  it('hides a mismatch after the timer fires', () => {
    render(<App />)
    click('card-c0') // A
    click('card-c1') // B (mismatch)
    expect(screen.getByTestId('card-c0')).toHaveTextContent('A')
    expect(screen.getByTestId('card-c1')).toHaveTextContent('B')
    act(() => {
      vi.advanceTimersByTime(800)
    })
    expect(screen.getByTestId('card-c0')).toHaveTextContent('')
    expect(screen.getByTestId('card-c1')).toHaveTextContent('')
    expect(screen.getByTestId('card-c0')).not.toBeDisabled()
  })

  it('winning the game records a best score', () => {
    render(<App />)
    // pairs: A=c0/c4, B=c1/c5, C=c2/c6, D=c3/c7
    const pairs = [
      ['card-c0', 'card-c4'],
      ['card-c1', 'card-c5'],
      ['card-c2', 'card-c6'],
      ['card-c3', 'card-c7'],
    ]
    pairs.forEach(([a, b]) => {
      click(a)
      click(b)
    })
    expect(screen.getByTestId('won')).toBeInTheDocument()
    expect(screen.getByTestId('moves')).toHaveTextContent('4')
    click('nav-scores')
    expect(screen.getByTestId('best')).toHaveTextContent('4')
  })

  it('new game resets the board', () => {
    render(<App />)
    click('card-c0')
    click('card-c4')
    expect(screen.getByTestId('matches')).toHaveTextContent('1')
    click('new-game')
    expect(screen.getByTestId('matches')).toHaveTextContent('0')
    expect(screen.getByTestId('card-c0')).toHaveTextContent('')
  })
})

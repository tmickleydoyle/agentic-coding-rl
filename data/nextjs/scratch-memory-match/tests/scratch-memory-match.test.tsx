import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../reference/app/page'

describe('Memory Match', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders the page title', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /memory match/i })).toBeInTheDocument()
  })

  it('renders 16 cards', () => {
    render(<App />)
    for (let i = 0; i < 16; i++) {
      expect(screen.getByTestId(`card-${i}`)).toBeInTheDocument()
    }
  })

  it('all cards start face-down showing ?', () => {
    render(<App />)
    for (let i = 0; i < 16; i++) {
      expect(screen.getByTestId(`card-${i}`).textContent).toBe('?')
    }
  })

  it('initial moves is 0', () => {
    render(<App />)
    expect(screen.getByTestId('moves').textContent).toBe('0')
  })

  it('initial matches is 0', () => {
    render(<App />)
    expect(screen.getByTestId('matches').textContent).toBe('0')
  })

  it('no win message initially', () => {
    render(<App />)
    expect(screen.queryByTestId('win-message')).not.toBeInTheDocument()
  })

  it('clicking a card reveals its emoji', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    const card = screen.getByTestId('card-0')
    await user.click(card)
    expect(card.textContent).not.toBe('?')
  })

  it('clicking two non-matching cards flips them back after delay', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)

    // Find two cards with different symbols by clicking them
    const card0 = screen.getByTestId('card-0')
    const card1 = screen.getByTestId('card-1')
    await user.click(card0)
    const sym0 = card0.textContent

    // Keep clicking until we find one different
    let differentIdx = -1
    for (let i = 1; i < 16; i++) {
      const c = screen.getByTestId(`card-${i}`)
      await user.click(c)
      if (c.textContent !== sym0) {
        differentIdx = i
        break
      }
      // same symbol matched — advance timer and continue with fresh pair
      act(() => { vi.advanceTimersByTime(400) })
    }

    if (differentIdx !== -1) {
      act(() => { vi.advanceTimersByTime(400) })
      expect(screen.getByTestId(`card-${differentIdx}`).textContent).toBe('?')
    }
  })

  it('moves counter increments after second card flip', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByTestId('card-0'))
    await user.click(screen.getByTestId('card-1'))
    act(() => { vi.advanceTimersByTime(400) })
    expect(parseInt(screen.getByTestId('moves').textContent ?? '0')).toBeGreaterThanOrEqual(1)
  })

  it('New Game resets moves and matches to 0', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByTestId('card-0'))
    await user.click(screen.getByTestId('card-1'))
    act(() => { vi.advanceTimersByTime(400) })
    await user.click(screen.getByTestId('new-game-btn'))
    expect(screen.getByTestId('moves').textContent).toBe('0')
    expect(screen.getByTestId('matches').textContent).toBe('0')
  })

  it('New Game resets all cards to face-down', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByTestId('card-0'))
    await user.click(screen.getByTestId('new-game-btn'))
    for (let i = 0; i < 16; i++) {
      expect(screen.getByTestId(`card-${i}`).textContent).toBe('?')
    }
  })

  it('shows New Game button', () => {
    render(<App />)
    expect(screen.getByTestId('new-game-btn')).toBeInTheDocument()
  })

  it('clicking same card twice does not flip second time', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<App />)
    await user.click(screen.getByTestId('card-0'))
    const sym = screen.getByTestId('card-0').textContent
    await user.click(screen.getByTestId('card-0'))
    // moves should still be 0 (second click on same card ignored)
    expect(screen.getByTestId('moves').textContent).toBe('0')
    expect(screen.getByTestId('card-0').textContent).toBe(sym)
  })
})

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import DebouncedSearch from '../components/DebouncedSearch'

describe('DebouncedSearch / useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('shows empty debounced value initially', () => {
    render(<DebouncedSearch />)
    expect(screen.getByTestId('debounced')).toHaveTextContent('')
    expect(screen.getByTestId('commits')).toHaveTextContent('0')
  })

  it('does not update before the delay elapses', () => {
    render(<DebouncedSearch />)
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'a' } })
    act(() => {
      vi.advanceTimersByTime(400)
    })
    expect(screen.getByTestId('debounced')).toHaveTextContent('')
  })

  it('updates once after the delay for a single change', () => {
    render(<DebouncedSearch />)
    fireEvent.change(screen.getByTestId('query'), { target: { value: 'a' } })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(screen.getByTestId('debounced')).toHaveTextContent('a')
    expect(screen.getByTestId('commits')).toHaveTextContent('1')
  })

  it('collapses rapid changes into a single commit', () => {
    render(<DebouncedSearch />)
    const input = screen.getByTestId('query')
    // Space the keystrokes 200ms apart (< 500ms delay) so a correct debounce
    // never lets an earlier timeout fire. A hook that fails to clear the prior
    // timeout will let each of the three timeouts fire in turn (3 commits).
    fireEvent.change(input, { target: { value: 'a' } })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    fireEvent.change(input, { target: { value: 'ab' } })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    fireEvent.change(input, { target: { value: 'abc' } })
    // Advance in separate flushes so any stray timeout commits land in distinct
    // renders (and thus get counted) rather than being batched away.
    for (let i = 0; i < 10; i++) {
      act(() => {
        vi.advanceTimersByTime(100)
      })
    }
    expect(screen.getByTestId('debounced')).toHaveTextContent('abc')
    expect(screen.getByTestId('commits')).toHaveTextContent('1')
  })

  it('commits again after a later quiet gap', () => {
    render(<DebouncedSearch />)
    const input = screen.getByTestId('query')
    fireEvent.change(input, { target: { value: 'a' } })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    fireEvent.change(input, { target: { value: 'ab' } })
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(screen.getByTestId('debounced')).toHaveTextContent('ab')
    expect(screen.getByTestId('commits')).toHaveTextContent('2')
  })
})

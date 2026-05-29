import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import Stopwatch from '../components/Stopwatch'

describe('Stopwatch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('starts at 0', () => {
    render(<Stopwatch />)
    expect(screen.getByTestId('elapsed')).toHaveTextContent('0')
  })

  it('ticks by 1 per second after start', () => {
    render(<Stopwatch />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(screen.getByTestId('elapsed')).toHaveTextContent('3')
  })

  it('does not double-speed when Start is clicked twice', () => {
    render(<Stopwatch />)
    fireEvent.click(screen.getByTestId('start'))
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    expect(screen.getByTestId('elapsed')).toHaveTextContent('2')
  })

  it('stop pauses the count', () => {
    render(<Stopwatch />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(2000)
    })
    fireEvent.click(screen.getByTestId('stop'))
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('elapsed')).toHaveTextContent('2')
  })

  it('reset returns the count to 0', () => {
    render(<Stopwatch />)
    fireEvent.click(screen.getByTestId('start'))
    act(() => {
      vi.advanceTimersByTime(3000)
    })
    fireEvent.click(screen.getByTestId('reset'))
    expect(screen.getByTestId('elapsed')).toHaveTextContent('0')
  })
})

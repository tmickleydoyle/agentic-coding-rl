import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Prime Sieve', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByText('Prime Sieve')).toBeInTheDocument()
  })

  it('shows 15 primes for default limit 50', () => {
    render(<App />)
    expect(screen.getByTestId('prime-count').textContent).toBe('15')
  })

  it('shows largest prime 47 for default limit 50', () => {
    render(<App />)
    expect(screen.getByTestId('largest-prime').textContent).toBe('47')
  })

  it('shows prime sum 328 for default limit 50', () => {
    render(<App />)
    expect(screen.getByTestId('prime-sum').textContent).toBe('328')
  })

  it('renders number cells from 2 to 50 by default', () => {
    render(<App />)
    const cells = screen.getAllByTestId('number-cell')
    expect(cells).toHaveLength(49) // 2..50
    expect(cells[0].textContent).toBe('2')
    expect(cells[cells.length - 1].textContent).toBe('50')
  })

  it('marks 2 as prime cell', () => {
    render(<App />)
    const primeCells = screen.getAllByTestId('prime-cell')
    const nums = primeCells.map(el => el.textContent)
    expect(nums.some(t => t?.includes('2'))).toBe(true)
  })

  it('marks 4 as composite cell', () => {
    render(<App />)
    const compositeCells = screen.getAllByTestId('composite-cell')
    const nums = compositeCells.map(el => el.textContent)
    expect(nums.some(t => t?.includes('4'))).toBe(true)
  })

  it('runs sieve for new limit on button click', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/upper limit/i))
    await user.type(screen.getByLabelText(/upper limit/i), '10')
    await user.click(screen.getByRole('button', { name: /run sieve/i }))
    // Primes up to 10: 2,3,5,7 = 4
    expect(screen.getByTestId('prime-count').textContent).toBe('4')
  })

  it('updates largest prime for limit 10', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/upper limit/i))
    await user.type(screen.getByLabelText(/upper limit/i), '10')
    await user.click(screen.getByRole('button', { name: /run sieve/i }))
    expect(screen.getByTestId('largest-prime').textContent).toBe('7')
  })

  it('limit 2 gives 1 prime', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/upper limit/i))
    await user.type(screen.getByLabelText(/upper limit/i), '2')
    await user.click(screen.getByRole('button', { name: /run sieve/i }))
    expect(screen.getByTestId('prime-count').textContent).toBe('1')
    expect(screen.getByTestId('largest-prime').textContent).toBe('2')
  })

  it('adds history entry on each run', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /run sieve/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: /run sieve/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(2)
  })

  it('history entry shows limit and prime count', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /run sieve/i }))
    const entry = screen.getByTestId('history-entry')
    expect(entry.textContent).toContain('50')
    expect(entry.textContent).toContain('15')
  })

  it('clear history removes all entries', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /run sieve/i }))
    await user.click(screen.getByRole('button', { name: /clear history/i }))
    expect(screen.queryAllByTestId('history-entry')).toHaveLength(0)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Sort Visualizer', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByText('Sort Visualizer')).toBeInTheDocument()
  })

  it('shows seed array on load', () => {
    render(<App />)
    const cells = screen.getAllByTestId('array-cell')
    const nums = cells.map(c => c.textContent)
    expect(nums).toContain('64')
    expect(nums).toContain('90')
  })

  it('shows step-count 0 on load', () => {
    render(<App />)
    expect(screen.getByTestId('step-count').textContent).toBe('0')
  })

  it('shows sort-status "In progress" on load', () => {
    render(<App />)
    expect(screen.getByTestId('sort-status').textContent).toBe('In progress')
  })

  it('shows swap-count 0 on load', () => {
    render(<App />)
    expect(screen.getByTestId('swap-count').textContent).toBe('0')
  })

  it('shows comparison-count 0 on load', () => {
    render(<App />)
    expect(screen.getByTestId('comparison-count').textContent).toBe('0')
  })

  it('increments comparison-count on step', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^step$/i }))
    expect(screen.getByTestId('comparison-count').textContent).toBe('1')
  })

  it('shows comparing-cell elements when stepping', async () => {
    const user = userEvent.setup()
    render(<App />)
    // After a step, there may be comparing cells (before done)
    await user.click(screen.getByRole('button', { name: /^step$/i }))
    // Should have either array-cell or comparing-cell for each element
    const allCells = [
      ...screen.queryAllByTestId('array-cell'),
      ...screen.queryAllByTestId('comparing-cell'),
    ]
    expect(allCells).toHaveLength(7)
  })

  it('sort all produces sorted array', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /sort all/i }))
    expect(screen.getByTestId('sort-status').textContent).toBe('Sorted')
    const cells = screen.getAllByTestId('array-cell')
    const nums = cells.map(c => Number(c.textContent))
    const sorted = [...nums].sort((a, b) => a - b)
    expect(nums).toEqual(sorted)
  })

  it('step and sort all buttons disabled when sorted', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /sort all/i }))
    expect(screen.getByRole('button', { name: /^step$/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /sort all/i })).toBeDisabled()
  })

  it('reset restores original array and counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^step$/i }))
    await user.click(screen.getByRole('button', { name: /^reset$/i }))
    expect(screen.getByTestId('step-count').textContent).toBe('0')
    expect(screen.getByTestId('swap-count').textContent).toBe('0')
    expect(screen.getByTestId('sort-status').textContent).toBe('In progress')
  })

  it('set array updates the array and resets counts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/array/i))
    await user.type(screen.getByLabelText(/array/i), '3, 1, 2')
    await user.click(screen.getByRole('button', { name: /set array/i }))
    const allCells = [
      ...screen.queryAllByTestId('array-cell'),
      ...screen.queryAllByTestId('comparing-cell'),
    ]
    expect(allCells).toHaveLength(3)
    expect(screen.getByTestId('step-count').textContent).toBe('0')
  })

  it('sort all on already-set custom array works', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/array/i))
    await user.type(screen.getByLabelText(/array/i), '5, 3, 8, 1')
    await user.click(screen.getByRole('button', { name: /set array/i }))
    await user.click(screen.getByRole('button', { name: /sort all/i }))
    expect(screen.getByTestId('sort-status').textContent).toBe('Sorted')
    const cells = screen.getAllByTestId('array-cell')
    const nums = cells.map(c => Number(c.textContent))
    expect(nums).toEqual([1, 3, 5, 8])
  })
})

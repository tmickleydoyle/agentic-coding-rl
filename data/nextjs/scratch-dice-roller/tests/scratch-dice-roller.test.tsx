import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Dice Roller', () => {
  it('renders heading and controls', () => {
    render(<App />)
    expect(screen.getByText('Dice Roller')).toBeInTheDocument()
    expect(screen.getByLabelText(/die type/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/number of dice/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /roll/i })).toBeInTheDocument()
  })

  it('shows dash in last-roll display before any roll', () => {
    render(<App />)
    expect(screen.getByTestId('last-roll-results').textContent).toBe('—')
    expect(screen.getByTestId('last-roll-sum').textContent).toBe('—')
    expect(screen.getByTestId('last-roll-count').textContent).toBe('—')
  })

  it('has no history entries before rolling', () => {
    render(<App />)
    expect(screen.queryAllByTestId('history-entry')).toHaveLength(0)
  })

  it('shows results after rolling', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /roll/i }))
    expect(screen.getByTestId('last-roll-results').textContent).not.toBe('—')
    expect(screen.getByTestId('last-roll-sum').textContent).not.toBe('—')
    expect(screen.getByTestId('last-roll-count').textContent).not.toBe('—')
  })

  it('adds a history entry after each roll', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /roll/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(1)
    await user.click(screen.getByRole('button', { name: /roll/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(2)
  })

  it('die results are within valid range for d6', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Set to 1 die to simplify range check
    await user.clear(screen.getByLabelText(/number of dice/i))
    await user.type(screen.getByLabelText(/number of dice/i), '1')
    await user.click(screen.getByRole('button', { name: /roll/i }))
    const result = parseInt(screen.getByTestId('last-roll-results').textContent || '0')
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(6)
  })

  it('count matches number of dice selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/number of dice/i))
    await user.type(screen.getByLabelText(/number of dice/i), '3')
    await user.click(screen.getByRole('button', { name: /roll/i }))
    expect(screen.getByTestId('last-roll-count').textContent).toBe('3')
  })

  it('sum equals sum of individual results', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/number of dice/i))
    await user.type(screen.getByLabelText(/number of dice/i), '4')
    await user.click(screen.getByRole('button', { name: /roll/i }))
    const resultsText = screen.getByTestId('last-roll-results').textContent || ''
    const vals = resultsText.split(',').map(s => parseInt(s.trim()))
    const manualSum = vals.reduce((a, b) => a + b, 0)
    const displayedSum = parseInt(screen.getByTestId('last-roll-sum').textContent || '0')
    expect(displayedSum).toBe(manualSum)
  })

  it('die results in range for d20', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/die type/i), 'd20')
    await user.clear(screen.getByLabelText(/number of dice/i))
    await user.type(screen.getByLabelText(/number of dice/i), '1')
    await user.click(screen.getByRole('button', { name: /roll/i }))
    const result = parseInt(screen.getByTestId('last-roll-results').textContent || '0')
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(20)
  })

  it('clear history removes all entries', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /roll/i }))
    await user.click(screen.getByRole('button', { name: /roll/i }))
    expect(screen.getAllByTestId('history-entry')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: /clear history/i }))
    expect(screen.queryAllByTestId('history-entry')).toHaveLength(0)
  })

  it('clear history resets last-roll display to dash', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /roll/i }))
    await user.click(screen.getByRole('button', { name: /clear history/i }))
    expect(screen.getByTestId('last-roll-results').textContent).toBe('—')
    expect(screen.getByTestId('last-roll-sum').textContent).toBe('—')
    expect(screen.getByTestId('last-roll-count').textContent).toBe('—')
  })

  it('history entry contains die type and results info', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText(/die type/i), 'd12')
    await user.click(screen.getByRole('button', { name: /roll/i }))
    const entry = screen.getByTestId('history-entry')
    expect(entry.textContent).toContain('d12')
  })

  it('rolling 1 die shows single result without comma', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/number of dice/i))
    await user.type(screen.getByLabelText(/number of dice/i), '1')
    await user.click(screen.getByRole('button', { name: /roll/i }))
    const resultsText = screen.getByTestId('last-roll-results').textContent || ''
    expect(resultsText).not.toContain(',')
  })
})

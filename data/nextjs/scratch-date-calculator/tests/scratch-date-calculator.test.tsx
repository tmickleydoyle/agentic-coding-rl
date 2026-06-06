import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Date Calculator', () => {
  it('renders heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /date calculator/i })).toBeInTheDocument()
  })

  it('shows -- initially in difference mode', () => {
    render(<App />)
    expect(screen.getByTestId('diff-days').textContent).toBe('--')
    expect(screen.getByTestId('diff-weeks').textContent).toBe('--')
    expect(screen.getByTestId('diff-summary').textContent).toBe('--')
  })

  it('calculates difference between two dates', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Start Date'), '2025-01-01')
    await user.type(screen.getByLabelText('End Date'), '2025-01-15')
    expect(screen.getByTestId('diff-days').textContent).toBe('14')
  })

  it('calculates weeks and remainder days', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Start Date'), '2025-01-01')
    await user.type(screen.getByLabelText('End Date'), '2025-01-22')
    // 21 days = 3 weeks 0 days
    expect(screen.getByTestId('diff-weeks').textContent).toContain('3 weeks')
    expect(screen.getByTestId('diff-weeks').textContent).toContain('0 days')
  })

  it('shows summary string', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Start Date'), '2025-01-01')
    await user.type(screen.getByLabelText('End Date'), '2025-01-15')
    expect(screen.getByTestId('diff-summary').textContent).toContain('14 days')
    expect(screen.getByTestId('diff-summary').textContent).toContain('2 weeks')
  })

  it('handles reverse date order (absolute difference)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Start Date'), '2025-01-15')
    await user.type(screen.getByLabelText('End Date'), '2025-01-01')
    expect(screen.getByTestId('diff-days').textContent).toBe('14')
  })

  it('shows 0 for same start and end date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Start Date'), '2025-06-01')
    await user.type(screen.getByLabelText('End Date'), '2025-06-01')
    expect(screen.getByTestId('diff-days').textContent).toBe('0')
  })

  it('switches to Add/Subtract mode and shows base/days inputs', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /add \/ subtract/i }))
    expect(screen.getByLabelText('Base Date')).toBeInTheDocument()
    expect(screen.getByLabelText('Days')).toBeInTheDocument()
    expect(screen.getByTestId('result-date').textContent).toBe('--')
  })

  it('adds days to a base date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /add \/ subtract/i }))
    await user.type(screen.getByLabelText('Base Date'), '2025-01-01')
    await user.type(screen.getByLabelText('Days'), '30')
    expect(screen.getByTestId('result-date').textContent).toContain('January')
    expect(screen.getByTestId('result-date').textContent).toContain('31')
  })

  it('subtracts days from a base date', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /add \/ subtract/i }))
    await user.type(screen.getByLabelText('Base Date'), '2025-02-01')
    await user.type(screen.getByLabelText('Days'), '-1')
    expect(screen.getByTestId('result-date').textContent).toContain('January')
    expect(screen.getByTestId('result-date').textContent).toContain('31')
  })

  it('switching modes clears inputs', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Start Date'), '2025-01-01')
    await user.type(screen.getByLabelText('End Date'), '2025-01-15')
    await user.click(screen.getByRole('button', { name: /add \/ subtract/i }))
    await user.click(screen.getByRole('button', { name: /difference/i }))
    expect(screen.getByTestId('diff-days').textContent).toBe('--')
  })

  it('reset button clears fields', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Start Date'), '2025-01-01')
    await user.type(screen.getByLabelText('End Date'), '2025-03-01')
    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('diff-days').textContent).toBe('--')
  })
})

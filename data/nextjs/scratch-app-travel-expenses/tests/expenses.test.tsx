import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('expenses by day', () => {
  it('lists seeded trips with their running total', () => {
    render(<App />)
    // tr1 = 200 + 50 + 30 = 280
    expect(screen.getByTestId('trip-tr1-total')).toHaveTextContent('280')
    expect(screen.getByTestId('trip-tr2-total')).toHaveTextContent('80')
  })

  it('opens a trip and breaks expenses down by day', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    expect(screen.getByTestId('page-expenses')).toBeInTheDocument()
    expect(screen.getByTestId('expenses-name')).toHaveTextContent('Paris')
    expect(screen.getByTestId('expenses-total')).toHaveTextContent('280')
    const day1 = screen.getByTestId('day-1-list')
    expect(within(day1).getByTestId('expense-e1')).toBeInTheDocument()
    expect(within(day1).getByTestId('expense-e2')).toBeInTheDocument()
    expect(screen.getByTestId('day-3-empty')).toBeInTheDocument()
  })

  it('shows per-day totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    // day 1 = 200 + 50 = 250, day 2 = 30
    expect(screen.getByTestId('day-1-total')).toHaveTextContent('250')
    expect(screen.getByTestId('day-2-total')).toHaveTextContent('30')
  })

  it('removes an expense and the running total drops', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    await user.click(screen.getByTestId('remove-e1'))
    expect(screen.queryByTestId('expense-e1')).not.toBeInTheDocument()
    expect(screen.getByTestId('expenses-total')).toHaveTextContent('80')
    expect(screen.getByTestId('day-1-total')).toHaveTextContent('50')
  })

  it('only shows expenses for the selected trip', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr2'))
    expect(screen.getByTestId('expense-e4')).toBeInTheDocument()
    expect(screen.queryByTestId('expense-e1')).not.toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('budget page', () => {
  it('shows seeded totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-budget'))
    expect(screen.getByTestId('stat-trips-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-activities-value')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-grand-total-value')).toHaveTextContent('205')
  })

  it('lists per-trip budgets', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-budget'))
    expect(screen.getByTestId('budget-tr1-cost')).toHaveTextContent('180')
    expect(screen.getByTestId('budget-tr2-cost')).toHaveTextContent('25')
  })

  it('persists theme across navigation via app-root data-theme', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-budget'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

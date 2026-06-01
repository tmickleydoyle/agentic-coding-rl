import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('budgets page', () => {
  it('shows an editor per category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-budgets'))
    expect(screen.getByTestId('budget-c1')).toBeInTheDocument()
    expect(screen.getByTestId('budget-c2')).toBeInTheDocument()
    expect(screen.getByTestId('budget-c3')).toBeInTheDocument()
  })

  it('raising a limit clears an over-limit flag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-budgets'))
    const input = screen.getByTestId('budget-c2-limit-input')
    await user.clear(input)
    await user.type(input, '600')
    await user.click(screen.getByTestId('budget-c2-save'))

    await user.click(screen.getByTestId('nav-categories'))
    // c2 spent 540 now under the raised 600 limit
    expect(screen.getByTestId('category-c2-limit')).toHaveTextContent('600')
    expect(screen.getByTestId('category-c2')).toHaveAttribute('data-over', 'false')
  })

  it('lowering a limit raises an over-limit flag', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-budgets'))
    const input = screen.getByTestId('budget-c1-limit-input')
    await user.clear(input)
    await user.type(input, '100')
    await user.click(screen.getByTestId('budget-c1-save'))

    await user.click(screen.getByTestId('nav-overview'))
    // c1 spent 180 now over the 100 limit, joining c2 => 2 over
    expect(screen.getByTestId('stat-overlimit-value')).toHaveTextContent('2')
  })
})

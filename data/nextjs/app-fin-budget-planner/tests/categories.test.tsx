import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function goToCategories(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId('nav-categories'))
}

describe('categories page', () => {
  it('lists all seeded categories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCategories(user)
    const list = screen.getByTestId('category-list')
    expect(within(list).getByText('Rent')).toBeInTheDocument()
    expect(within(list).getByText('Groceries')).toBeInTheDocument()
    expect(within(list).getByText('Transport')).toBeInTheDocument()
  })

  it('shows planned, actual, and remaining per category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCategories(user)
    expect(screen.getByTestId('category-c2-planned')).toHaveTextContent('400')
    expect(screen.getByTestId('category-c2-actual')).toHaveTextContent('460')
    expect(screen.getByTestId('category-c2-remaining')).toHaveTextContent('-60')
  })

  it('flags only over-budget categories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await goToCategories(user)
    expect(screen.getByTestId('category-c2')).toHaveAttribute('data-over', 'true')
    expect(screen.getByTestId('category-c2-alert')).toBeInTheDocument()
    expect(screen.getByTestId('category-c1')).toHaveAttribute('data-over', 'false')
    expect(screen.queryByTestId('category-c1-alert')).not.toBeInTheDocument()
    expect(screen.getByTestId('category-c3')).toHaveAttribute('data-over', 'false')
  })

  it('reflects a newly added expense in the actual amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-expense'))
    await user.selectOptions(screen.getByTestId('category-select'), 'c1')
    await user.type(screen.getByTestId('amount-input'), '100')
    await user.click(screen.getByTestId('submit-expense'))
    await goToCategories(user)
    // Rent actual now 1300, over budget by 100
    expect(screen.getByTestId('category-c1-actual')).toHaveTextContent('1300')
    expect(screen.getByTestId('category-c1')).toHaveAttribute('data-over', 'true')
  })
})

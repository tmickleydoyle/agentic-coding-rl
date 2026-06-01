import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add-expense flow', () => {
  it('blocks submitting with an empty amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-expense'))
    await user.click(screen.getByTestId('submit-expense'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-expense')).toBeInTheDocument()
  })

  it('blocks submitting a non-positive amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-expense'))
    await user.type(screen.getByTestId('amount-input'), '0')
    await user.click(screen.getByTestId('submit-expense'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add-expense')).toBeInTheDocument()
  })

  it('adds an expense and navigates to the overview', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-expense'))
    await user.selectOptions(screen.getByTestId('category-select'), 'c2')
    await user.type(screen.getByTestId('amount-input'), '25')
    await user.type(screen.getByTestId('note-input'), 'Snacks')
    await user.click(screen.getByTestId('submit-expense'))
    expect(screen.getByTestId('page-overview')).toBeInTheDocument()
    // Groceries actual now 485
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('category-c2-actual')).toHaveTextContent('485')
  })

  it('does not change totals when submission is blocked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-expense'))
    await user.type(screen.getByTestId('amount-input'), '-5')
    await user.click(screen.getByTestId('submit-expense'))
    await user.click(screen.getByTestId('nav-overview'))
    expect(screen.getByTestId('stat-actual-value')).toHaveTextContent('1660')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('add expense flow', () => {
  it('blocks submitting with a missing or zero amount', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.click(screen.getByTestId('submit-expense'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('adds an expense to a trip+day and shows it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr1'))
    await user.click(screen.getByTestId('add-link'))
    await user.selectOptions(screen.getByTestId('trip-select'), 'tr1')
    await user.clear(screen.getByTestId('day-input'))
    await user.type(screen.getByTestId('day-input'), '2')
    await user.selectOptions(screen.getByTestId('category-select'), 'activities')
    await user.type(screen.getByTestId('amount-input'), '45')
    await user.type(screen.getByTestId('note-input'), 'Museum')
    await user.click(screen.getByTestId('submit-expense'))
    expect(screen.getByTestId('page-expenses')).toBeInTheDocument()
    const day2 = screen.getByTestId('day-2-list')
    expect(within(day2).getByText('Museum')).toBeInTheDocument()
    // day-2 total was 30, now 75
    expect(screen.getByTestId('day-2-total')).toHaveTextContent('75')
  })

  it('raises the trip running total after adding', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-tr2'))
    await user.click(screen.getByTestId('add-link'))
    await user.selectOptions(screen.getByTestId('trip-select'), 'tr2')
    await user.type(screen.getByTestId('amount-input'), '20')
    await user.click(screen.getByTestId('submit-expense'))
    // tr2 was 80, now 100
    expect(screen.getByTestId('expenses-total')).toHaveTextContent('100')
  })
})

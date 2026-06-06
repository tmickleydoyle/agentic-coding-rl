import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Expense Form', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('shows 3 seed expense rows', () => {
    expect(screen.getAllByTestId('expense-row')).toHaveLength(3)
  })

  it('shows seed data correctly', () => {
    const rows = screen.getAllByTestId('expense-row')
    expect(rows[0]).toHaveTextContent('Coffee')
    expect(rows[0]).toHaveTextContent('Food')
    expect(rows[0]).toHaveTextContent('4.50')
    expect(rows[1]).toHaveTextContent('Bus ticket')
    expect(rows[2]).toHaveTextContent('Notebook')
  })

  it('shows correct initial total', () => {
    expect(screen.getByTestId('total')).toHaveTextContent('Total: $16.24')
  })

  it('adds a new expense and shows it in the list', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/description/i), 'Lunch')
    await user.clear(screen.getByLabelText(/^amount$/i))
    await user.type(screen.getByLabelText(/^amount$/i), '12.50')
    await user.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getAllByTestId('expense-row')).toHaveLength(4)
    expect(screen.getByText(/Lunch/)).toBeInTheDocument()
  })

  it('updates total after adding an expense', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/description/i), 'Lunch')
    await user.clear(screen.getByLabelText(/^amount$/i))
    await user.type(screen.getByLabelText(/^amount$/i), '12.50')
    await user.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByTestId('total')).toHaveTextContent('Total: $28.74')
  })

  it('clears the form fields after adding', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/description/i), 'Dinner')
    await user.clear(screen.getByLabelText(/^amount$/i))
    await user.type(screen.getByLabelText(/^amount$/i), '20.00')
    await user.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getByLabelText(/description/i)).toHaveValue('')
    expect(screen.getByLabelText(/^amount$/i)).toHaveValue(null)
  })

  it('does not add expense when description is empty', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByLabelText(/^amount$/i))
    await user.type(screen.getByLabelText(/^amount$/i), '5.00')
    await user.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getAllByTestId('expense-row')).toHaveLength(3)
  })

  it('does not add expense when amount is zero or negative', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/description/i), 'Zero')
    await user.clear(screen.getByLabelText(/^amount$/i))
    await user.type(screen.getByLabelText(/^amount$/i), '0')
    await user.click(screen.getByRole('button', { name: /add expense/i }))
    expect(screen.getAllByTestId('expense-row')).toHaveLength(3)
  })

  it('deletes an expense row', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('expense-row')
    await user.click(within(rows[0]).getByRole('button', { name: /delete/i }))
    expect(screen.getAllByTestId('expense-row')).toHaveLength(2)
    expect(screen.queryByText('Coffee')).not.toBeInTheDocument()
  })

  it('updates total after deleting an expense', async () => {
    const user = userEvent.setup()
    const rows = screen.getAllByTestId('expense-row')
    await user.click(within(rows[0]).getByRole('button', { name: /delete/i }))
    // 16.24 - 4.50 = 11.74
    expect(screen.getByTestId('total')).toHaveTextContent('Total: $11.74')
  })

  it('filters rows by category without changing total', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Food')
    const rows = screen.getAllByTestId('expense-row')
    expect(rows).toHaveLength(1)
    expect(rows[0]).toHaveTextContent('Coffee')
    // total is still all expenses
    expect(screen.getByTestId('total')).toHaveTextContent('Total: $16.24')
  })

  it('shows all rows when filter is set back to All', async () => {
    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'Food')
    await user.selectOptions(screen.getByLabelText(/filter by category/i), 'All')
    expect(screen.getAllByTestId('expense-row')).toHaveLength(3)
  })
})

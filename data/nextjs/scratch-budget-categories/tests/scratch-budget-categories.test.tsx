import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Budget Categories', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders 4 seed categories', () => {
    expect(screen.getAllByTestId('category-row')).toHaveLength(4)
  })

  it('shows correct total budget for seed data', () => {
    // 1500+600+300+200 = 2600
    expect(screen.getByTestId('total-budget').textContent).toContain('$2600.00')
  })

  it('shows correct total spent for seed data', () => {
    // 1450+720+280+350 = 2800
    expect(screen.getByTestId('total-spent').textContent).toContain('$2800.00')
  })

  it('shows correct total variance for seed data', () => {
    // 2600-2800 = -200
    expect(screen.getByTestId('total-variance').textContent).toContain('-$200.00')
  })

  it('shows overall status as Over Budget for seed data', () => {
    expect(screen.getByTestId('overall-status').textContent).toBe('Over Budget')
  })

  it('marks Food as Over Budget', () => {
    const rows = screen.getAllByTestId('category-row')
    const foodRow = rows[1]
    const status = foodRow.querySelector('[data-testid="status"]')
    expect(status?.textContent).toBe('Over Budget')
  })

  it('marks Housing as Under Budget', () => {
    const rows = screen.getAllByTestId('category-row')
    const housingRow = rows[0]
    const status = housingRow.querySelector('[data-testid="status"]')
    expect(status?.textContent).toBe('Under Budget')
  })

  it('adds a new category', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/category name/i), 'Savings')
    await user.type(screen.getByLabelText(/budget amount/i), '400')
    await user.type(screen.getByLabelText(/spent amount/i), '200')
    await user.click(screen.getByRole('button', { name: /add category/i }))
    expect(screen.getAllByTestId('category-row')).toHaveLength(5)
    expect(screen.getByText('Savings')).toBeInTheDocument()
  })

  it('clears form after adding category', async () => {
    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/category name/i), 'Savings')
    await user.click(screen.getByRole('button', { name: /add category/i }))
    expect(screen.getByLabelText(/category name/i)).toHaveValue('')
  })

  it('does not add category with empty name', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add category/i }))
    expect(screen.getAllByTestId('category-row')).toHaveLength(4)
  })

  it('deletes a category', async () => {
    const user = userEvent.setup()
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('category-row')).toHaveLength(3)
  })

  it('recalculates totals after deletion', async () => {
    const user = userEvent.setup()
    // Delete Housing (budget=1500, spent=1450)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    // remaining budget: 600+300+200=1100, spent: 720+280+350=1350
    expect(screen.getByTestId('total-budget').textContent).toContain('$1100.00')
    expect(screen.getByTestId('total-spent').textContent).toContain('$1350.00')
  })

  it('shows Under Budget overall and $0.00 when all deleted', async () => {
    const user = userEvent.setup()
    let deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    for (let i = 0; i < 4; i++) {
      await user.click(screen.getAllByRole('button', { name: /delete/i })[0])
    }
    expect(screen.getByTestId('total-budget').textContent).toContain('$0.00')
    expect(screen.getByTestId('overall-status').textContent).toBe('Under Budget')
  })
})

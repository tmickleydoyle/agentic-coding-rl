import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Meal Cost Splitter App', () => {
  it('renders the page heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /meal cost splitter/i })).toBeInTheDocument()
  })

  it('shows 4 seed items', () => {
    render(<App />)
    expect(screen.getAllByTestId('bill-item')).toHaveLength(4)
  })

  it('shows grand total with 15% tip from seed data', () => {
    render(<App />)
    // subtotal = 8.50 + 14.00 + 12.50 + 4.00 = 39.00
    // tip 15% = 5.85, total = 44.85
    expect(screen.getByTestId('grand-total').textContent).toBe('$44.85')
  })

  it('shows 3 person totals', () => {
    render(<App />)
    expect(screen.getAllByTestId('person-total')).toHaveLength(3)
  })

  it('Alice total includes her items + tip share', () => {
    render(<App />)
    // Alice: 8.50 + 4.00 = 12.50, tip = 12.50/39*5.85 = 1.875
    // total = 14.375 -> $14.38
    const totals = screen.getAllByTestId('person-total')
    const aliceTotal = totals.find(t => t.textContent?.startsWith('Alice'))
    expect(aliceTotal?.textContent).toContain('$14.38')
  })

  it('adds a new person', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/person name/i), 'Dave')
    await user.click(screen.getByRole('button', { name: /add person/i }))
    expect(screen.getAllByTestId('person-total')).toHaveLength(4)
  })

  it('new person appears in assign to dropdown', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/person name/i), 'Eve')
    await user.click(screen.getByRole('button', { name: /add person/i }))
    expect(screen.getByLabelText(/assign to/i)).toHaveTextContent('Eve')
  })

  it('adds a new bill item', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/item name/i), 'Dessert')
    await user.clear(screen.getByLabelText(/item price/i))
    await user.type(screen.getByLabelText(/item price/i), '6.00')
    await user.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getAllByTestId('bill-item')).toHaveLength(5)
  })

  it('deletes a bill item', async () => {
    const user = userEvent.setup()
    render(<App />)
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getAllByTestId('bill-item')).toHaveLength(3)
  })

  it('grand total updates after deleting an item', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Delete Caesar Salad (8.50), new subtotal = 30.50, tip 15% = 4.575, total = 35.075 -> $35.08
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
    await user.click(deleteButtons[0])
    expect(screen.getByTestId('grand-total').textContent).toBe('$35.08')
  })

  it('changing tip % updates grand total', async () => {
    const user = userEvent.setup()
    render(<App />)
    // subtotal 39.00, tip 20% = 7.80, total = 46.80
    await user.clear(screen.getByLabelText(/tip %/i))
    await user.type(screen.getByLabelText(/tip %/i), '20')
    expect(screen.getByTestId('grand-total').textContent).toBe('$46.80')
  })

  it('empty person name does not add person', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /add person/i }))
    expect(screen.getAllByTestId('person-total')).toHaveLength(3)
  })

  it('does not add item with empty name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByLabelText(/item price/i))
    await user.type(screen.getByLabelText(/item price/i), '5.00')
    await user.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getAllByTestId('bill-item')).toHaveLength(4)
  })
})

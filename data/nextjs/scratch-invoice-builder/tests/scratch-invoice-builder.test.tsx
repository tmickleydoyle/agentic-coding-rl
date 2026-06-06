import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('Invoice Builder', () => {
  beforeEach(() => {
    render(<App />)
  })

  it('renders seed line items', () => {
    expect(screen.getAllByTestId('line-item')).toHaveLength(2)
  })

  it('shows correct subtotal for seed data', () => {
    // 2*500 + 1*250 = 1250
    expect(screen.getByTestId('subtotal').textContent).toContain('$1250.00')
  })

  it('shows correct tax amount for default 10% rate', () => {
    // 1250 * 0.10 = 125
    expect(screen.getByTestId('tax-amount').textContent).toContain('$125.00')
  })

  it('shows correct total for seed data', () => {
    // 1250 + 125 = 1375
    expect(screen.getByTestId('invoice-total').textContent).toContain('$1375.00')
  })

  it('adds a new line item', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getAllByTestId('line-item')).toHaveLength(3)
  })

  it('removes a line item', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /remove 1/i }))
    expect(screen.getAllByTestId('line-item')).toHaveLength(1)
  })

  it('recalculates subtotal after removal', async () => {
    const user = userEvent.setup()
    // Remove Web Design (2*500=1000), leaving Logo Design (250)
    await user.click(screen.getByRole('button', { name: /remove 1/i }))
    expect(screen.getByTestId('subtotal').textContent).toContain('$250.00')
  })

  it('updates totals when tax rate changes', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByLabelText(/tax rate/i))
    await user.type(screen.getByLabelText(/tax rate/i), '20')
    // 1250 * 0.20 = 250
    expect(screen.getByTestId('tax-amount').textContent).toContain('$250.00')
    expect(screen.getByTestId('invoice-total').textContent).toContain('$1500.00')
  })

  it('shows zero totals when all items removed', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /remove 1/i }))
    await user.click(screen.getByRole('button', { name: /remove 1/i }))
    expect(screen.getByTestId('subtotal').textContent).toContain('$0.00')
    expect(screen.getByTestId('invoice-total').textContent).toContain('$0.00')
  })

  it('allows editing client name', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText(/client name/i)
    await user.clear(input)
    await user.type(input, 'New Client')
    expect(input).toHaveValue('New Client')
  })

  it('allows editing invoice number', async () => {
    const user = userEvent.setup()
    const input = screen.getByLabelText(/invoice number/i)
    await user.clear(input)
    await user.type(input, 'INV-999')
    expect(input).toHaveValue('INV-999')
  })

  it('updates line total when qty changes', async () => {
    const user = userEvent.setup()
    const qtyInput = screen.getByLabelText(/qty 1/i)
    await user.clear(qtyInput)
    await user.type(qtyInput, '3')
    // 3*500 = 1500, + 250 = 1750
    expect(screen.getByTestId('subtotal').textContent).toContain('$1750.00')
  })

  it('tax rate 0 means no tax', async () => {
    const user = userEvent.setup()
    await user.clear(screen.getByLabelText(/tax rate/i))
    await user.type(screen.getByLabelText(/tax rate/i), '0')
    expect(screen.getByTestId('tax-amount').textContent).toContain('$0.00')
    expect(screen.getByTestId('invoice-total').textContent).toContain('$1250.00')
  })
})

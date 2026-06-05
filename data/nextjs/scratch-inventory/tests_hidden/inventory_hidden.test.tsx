// HELD-OUT generalization tests — overlaid only at eval.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

function rowFor(name: string): HTMLElement {
  const cell = screen.getByText(new RegExp(name))
  const row = cell.closest('tr')
  if (!row) throw new Error(`no row for ${name}`)
  return row as HTMLElement
}

describe('Inventory Tracker (held-out)', () => {
  it('initial total value is correct to two decimal places', () => {
    render(<App />)
    expect(screen.getByText('Total value: $148.75')).toBeInTheDocument()
  })

  it('total value updates correctly after multiple increments on one item', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = rowFor('Gadget B')
    // Gadget B: price 12.50, stock starts at 3
    await u.click(within(row).getByRole('button', { name: /increase/i }))
    await u.click(within(row).getByRole('button', { name: /increase/i }))
    // stock now 5, value = 5*10 + 12.5*5 + 8.75*7 = 50 + 62.5 + 61.25 = 173.75
    expect(screen.getByText('Total value: $173.75')).toBeInTheDocument()
  })

  it('Low stock disappears on Widget A when stock falls to 4 then reappears at 5 after increase', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = rowFor('Widget A')
    // decrease Widget A from 10 down to 4 (6 clicks)
    for (let i = 0; i < 6; i++) {
      await u.click(within(row).getByRole('button', { name: /decrease/i }))
    }
    expect(within(row).getByText(/Low stock/)).toBeInTheDocument()
    // increase back to 5 -> low stock gone
    await u.click(within(row).getByRole('button', { name: /increase/i }))
    expect(within(row).queryByText(/Low stock/)).toBeNull()
  })

  it('adding two items increments total items correctly', async () => {
    const u = userEvent.setup()
    render(<App />)
    const addOne = async (name: string, price: string, stock: string) => {
      await u.clear(screen.getByLabelText(/item name/i))
      await u.type(screen.getByLabelText(/item name/i), name)
      await u.clear(screen.getByLabelText(/price/i))
      await u.type(screen.getByLabelText(/price/i), price)
      await u.clear(screen.getByLabelText(/stock/i))
      await u.type(screen.getByLabelText(/stock/i), stock)
      await u.click(screen.getByRole('button', { name: /add item/i }))
    }
    await addOne('Alpha', '2.00', '5')
    await addOne('Beta', '4.00', '3')
    expect(screen.getByText('Total items: 5')).toBeInTheDocument()
  })

  it('decrease on a stock-1 item goes to 0 and disables button', async () => {
    const u = userEvent.setup()
    render(<App />)
    // add item with stock 1
    await u.type(screen.getByLabelText(/item name/i), 'Solo')
    await u.type(screen.getByLabelText(/price/i), '10')
    await u.type(screen.getByLabelText(/stock/i), '1')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    const row = rowFor('Solo')
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    expect(within(row).getByText('0')).toBeInTheDocument()
    expect(within(row).getByRole('button', { name: /decrease/i })).toBeDisabled()
  })

  it('total value accounts for newly added item after stock change', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), 'Extra')
    await u.type(screen.getByLabelText(/price/i), '10.00')
    await u.type(screen.getByLabelText(/stock/i), '5')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    // total before increase: 148.75 + 10*5 = 198.75
    expect(screen.getByText('Total value: $198.75')).toBeInTheDocument()
    const row = rowFor('Extra')
    await u.click(within(row).getByRole('button', { name: /increase/i }))
    // Extra stock now 6: 148.75 + 10*6 = 208.75
    expect(screen.getByText('Total value: $208.75')).toBeInTheDocument()
  })

  it('ignores add when stock is negative (non-integer negative input)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), 'NegItem')
    await u.type(screen.getByLabelText(/price/i), '5')
    await u.type(screen.getByLabelText(/stock/i), '-3')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })

  it('multiple independent items can all be Low stock simultaneously', async () => {
    const u = userEvent.setup()
    render(<App />)
    // decrease Doohickey C to 4 (3 decrements)
    const rowC = rowFor('Doohickey C')
    await u.click(within(rowC).getByRole('button', { name: /decrease/i }))
    await u.click(within(rowC).getByRole('button', { name: /decrease/i }))
    await u.click(within(rowC).getByRole('button', { name: /decrease/i }))
    // Gadget B already low, Doohickey C now low too
    expect(within(rowFor('Gadget B')).getByText(/Low stock/)).toBeInTheDocument()
    expect(within(rowFor('Doohickey C')).getByText(/Low stock/)).toBeInTheDocument()
    expect(within(rowFor('Widget A')).queryByText(/Low stock/)).toBeNull()
  })
})

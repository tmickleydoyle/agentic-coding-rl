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

describe('Inventory Tracker', () => {
  it('renders initial three items', () => {
    render(<App />)
    expect(screen.getByText(/Widget A/)).toBeInTheDocument()
    expect(screen.getByText(/Gadget B/)).toBeInTheDocument()
    expect(screen.getByText(/Doohickey C/)).toBeInTheDocument()
  })

  it('shows correct initial total items count', () => {
    render(<App />)
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })

  it('shows correct initial total value', () => {
    render(<App />)
    // Widget A: 5*10=50, Gadget B: 12.5*3=37.5, Doohickey C: 8.75*7=61.25 => 148.75
    expect(screen.getByText('Total value: $148.75')).toBeInTheDocument()
  })

  it('flags Gadget B as Low stock initially (stock 3 < threshold 5)', () => {
    render(<App />)
    const row = rowFor('Gadget B')
    expect(within(row).getByText(/Low stock/)).toBeInTheDocument()
  })

  it('does not flag Widget A or Doohickey C as Low stock initially', () => {
    render(<App />)
    const rowA = rowFor('Widget A')
    const rowC = rowFor('Doohickey C')
    expect(within(rowA).queryByText(/Low stock/)).toBeNull()
    expect(within(rowC).queryByText(/Low stock/)).toBeNull()
  })

  it('increases stock with Increase button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = rowFor('Widget A')
    await u.click(within(row).getByRole('button', { name: /increase/i }))
    expect(within(row).getByText('11')).toBeInTheDocument()
  })

  it('decreases stock with Decrease button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = rowFor('Widget A')
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    expect(within(row).getByText('9')).toBeInTheDocument()
  })

  it('Decrease button is disabled when stock is 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = rowFor('Gadget B')
    // Gadget B starts at 3, decrease 3 times
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    expect(within(row).getByRole('button', { name: /decrease/i })).toBeDisabled()
  })

  it('stock does not go below 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = rowFor('Gadget B')
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    expect(within(row).getByText('0')).toBeInTheDocument()
  })

  it('Low stock flag appears when stock drops below threshold', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = rowFor('Doohickey C')
    // stock starts at 7, decrease 3 times -> 4, below threshold 5
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    await u.click(within(row).getByRole('button', { name: /decrease/i }))
    expect(within(row).getByText(/Low stock/)).toBeInTheDocument()
  })

  it('Low stock flag disappears when stock rises to threshold', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = rowFor('Gadget B')
    // Gadget B starts at 3 (low stock), increase to 5 -> no longer low
    await u.click(within(row).getByRole('button', { name: /increase/i }))
    await u.click(within(row).getByRole('button', { name: /increase/i }))
    expect(within(row).queryByText(/Low stock/)).toBeNull()
  })

  it('total value updates after stock change', async () => {
    const u = userEvent.setup()
    render(<App />)
    const row = rowFor('Widget A')
    // increase Widget A by 1: 11*5=55, total = 55+37.5+61.25 = 153.75
    await u.click(within(row).getByRole('button', { name: /increase/i }))
    expect(screen.getByText('Total value: $153.75')).toBeInTheDocument()
  })

  it('adds a new item and updates total items count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), 'Sprocket D')
    await u.type(screen.getByLabelText(/price/i), '3.00')
    await u.type(screen.getByLabelText(/stock/i), '20')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText(/Sprocket D/)).toBeInTheDocument()
    expect(screen.getByText('Total items: 4')).toBeInTheDocument()
  })

  it('adds a new item and updates total value', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), 'Sprocket D')
    await u.type(screen.getByLabelText(/price/i), '3.00')
    await u.type(screen.getByLabelText(/stock/i), '20')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    // 148.75 + 3*20 = 148.75 + 60 = 208.75
    expect(screen.getByText('Total value: $208.75')).toBeInTheDocument()
  })

  it('clears inputs after adding an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), 'Sprocket D')
    await u.type(screen.getByLabelText(/price/i), '3.00')
    await u.type(screen.getByLabelText(/stock/i), '20')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByLabelText(/item name/i)).toHaveValue('')
    expect(screen.getByLabelText(/price/i)).toHaveValue(null)
    expect(screen.getByLabelText(/stock/i)).toHaveValue(null)
  })

  it('ignores add when item name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/price/i), '5.00')
    await u.type(screen.getByLabelText(/stock/i), '10')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })

  it('ignores add when price is zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), 'Bad Item')
    await u.type(screen.getByLabelText(/price/i), '0')
    await u.type(screen.getByLabelText(/stock/i), '10')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.getByText('Total items: 3')).toBeInTheDocument()
  })

  it('new item with stock below threshold shows Low stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText(/item name/i), 'Rare Part')
    await u.type(screen.getByLabelText(/price/i), '99.99')
    await u.type(screen.getByLabelText(/stock/i), '2')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    const row = rowFor('Rare Part')
    expect(within(row).getByText(/Low stock/)).toBeInTheDocument()
  })
})

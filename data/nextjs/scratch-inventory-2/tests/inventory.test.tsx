import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

function rowFor(name: string): HTMLElement {
  return screen.getByRole('row', { name: new RegExp(name) })
}

describe('Inventory Tracker', () => {
  it('renders the table headings', () => {
    render(<App />)
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Stock' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Price' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeInTheDocument()
  })

  it('shows the three pre-seeded items', () => {
    render(<App />)
    expect(screen.getByText('Apples')).toBeInTheDocument()
    expect(screen.getByText('Bananas')).toBeInTheDocument()
    expect(screen.getByText('Cherries')).toBeInTheDocument()
  })

  it('displays price formatted with $ and two decimals', () => {
    render(<App />)
    const applesRow = rowFor('Apples')
    expect(within(applesRow).getByText('$0.50')).toBeInTheDocument()
  })

  it('displays value as stock × price', () => {
    render(<App />)
    // Apples: 10 × 0.50 = $5.00
    const applesRow = rowFor('Apples')
    expect(within(applesRow).getByText('$5.00')).toBeInTheDocument()
  })

  it('shows Low stock for Bananas (stock=3) on load', () => {
    render(<App />)
    const bananasRow = rowFor('Bananas')
    expect(within(bananasRow).getByText('Low stock')).toBeInTheDocument()
  })

  it('does not show Low stock for Cherries (stock=50) on load', () => {
    render(<App />)
    const cherriesRow = rowFor('Cherries')
    expect(within(cherriesRow).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('shows the correct initial total inventory value', () => {
    render(<App />)
    // Apples: 10×0.50=5, Bananas: 3×0.25=0.75, Cherries: 50×2.00=100 => 105.75
    expect(screen.getByText('Total inventory value: $105.75')).toBeInTheDocument()
  })

  it('increments stock with + button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const applesRow = rowFor('Apples')
    await u.click(within(applesRow).getByRole('button', { name: '+' }))
    expect(within(applesRow).getByText('11')).toBeInTheDocument()
  })

  it('updates value after incrementing stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    const applesRow = rowFor('Apples')
    await u.click(within(applesRow).getByRole('button', { name: '+' }))
    // 11 × 0.50 = $5.50
    expect(within(applesRow).getByText('$5.50')).toBeInTheDocument()
  })

  it('decrements stock with − button', async () => {
    const u = userEvent.setup()
    render(<App />)
    const cherriesRow = rowFor('Cherries')
    await u.click(within(cherriesRow).getByRole('button', { name: '−' }))
    expect(within(cherriesRow).getByText('49')).toBeInTheDocument()
  })

  it('disables − button when stock is 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    const bananasRow = rowFor('Bananas')
    const decBtn = within(bananasRow).getByRole('button', { name: '−' })
    await u.click(decBtn) // 2
    await u.click(decBtn) // 1
    await u.click(decBtn) // 0
    expect(decBtn).toBeDisabled()
  })

  it('shows Low stock after decrementing into threshold', async () => {
    const u = userEvent.setup()
    render(<App />)
    const cherriesRow = rowFor('Cherries')
    const decBtn = within(cherriesRow).getByRole('button', { name: '−' })
    // decrement from 50 down to 5 (45 clicks)
    for (let i = 0; i < 45; i++) {
      await u.click(decBtn)
    }
    expect(within(cherriesRow).getByText('Low stock')).toBeInTheDocument()
  })

  it('removes Low stock label after incrementing above threshold', async () => {
    const u = userEvent.setup()
    render(<App />)
    const bananasRow = rowFor('Bananas')
    const incBtn = within(bananasRow).getByRole('button', { name: '+' })
    // Bananas starts at 3, need to get to 6
    await u.click(incBtn)
    await u.click(incBtn)
    await u.click(incBtn)
    expect(within(bananasRow).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('updates total after stock changes', async () => {
    const u = userEvent.setup()
    render(<App />)
    const applesRow = rowFor('Apples')
    await u.click(within(applesRow).getByRole('button', { name: '+' }))
    // 11×0.50 + 3×0.25 + 50×2.00 = 5.50 + 0.75 + 100 = 106.25
    expect(screen.getByText('Total inventory value: $106.25')).toBeInTheDocument()
  })

  it('adds a new item and shows it in the table', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item name'), 'Mangoes')
    await u.type(screen.getByLabelText('Stock'), '20')
    await u.type(screen.getByLabelText('Price ($)'), '1.50')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    expect(screen.getByText('Mangoes')).toBeInTheDocument()
    const mangoesRow = rowFor('Mangoes')
    expect(within(mangoesRow).getByText('$30.00')).toBeInTheDocument()
  })

  it('clears inputs after adding an item', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item name'), 'Mangoes')
    await u.type(screen.getByLabelText('Stock'), '20')
    await u.type(screen.getByLabelText('Price ($)'), '1.50')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    expect(screen.getByLabelText('Item name')).toHaveValue('')
    expect(screen.getByLabelText('Stock')).toHaveValue(null)
    expect(screen.getByLabelText('Price ($)')).toHaveValue(null)
  })

  it('does not add item with blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Stock'), '5')
    await u.type(screen.getByLabelText('Price ($)'), '1.00')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    expect(screen.getAllByRole('row')).toHaveLength(4) // header + 3 seed rows
  })

  it('includes new item value in total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Item name'), 'Grapes')
    await u.type(screen.getByLabelText('Stock'), '4')
    await u.type(screen.getByLabelText('Price ($)'), '3.00')
    await u.click(screen.getByRole('button', { name: 'Add item' }))
    // 105.75 + 4×3.00 = 105.75 + 12.00 = 117.75
    expect(screen.getByText('Total inventory value: $117.75')).toBeInTheDocument()
  })
})

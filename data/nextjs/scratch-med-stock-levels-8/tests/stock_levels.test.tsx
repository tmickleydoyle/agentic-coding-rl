import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

function row(name: string): HTMLElement {
  const el = screen.getByText(name).closest('li')
  if (!el) throw new Error(`no row for ${name}`)
  return el as HTMLElement
}

async function addProduct(u: U, name: string, onHand: string, reorder: string, price: string) {
  await u.clear(screen.getByLabelText('Product name'))
  await u.type(screen.getByLabelText('Product name'), name)
  await u.clear(screen.getByLabelText('On hand'))
  await u.type(screen.getByLabelText('On hand'), onHand)
  await u.clear(screen.getByLabelText('Reorder point'))
  await u.type(screen.getByLabelText('Reorder point'), reorder)
  await u.clear(screen.getByLabelText('Unit price'))
  await u.type(screen.getByLabelText('Unit price'), price)
  await u.click(screen.getByRole('button', { name: /add product/i }))
}

describe('Stock Levels app', () => {
  it('starts on Inventory view with seeded products', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByText('Gadget B')).toBeInTheDocument()
    expect(screen.getByText('Doohickey C')).toBeInTheDocument()
  })

  it('navigates to Summary view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
  })

  it('navigates to Settings view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('shows Low stock label for Gadget B (8 < 15)', () => {
    render(<App />)
    expect(within(row('Gadget B')).getByText('Low stock')).toBeInTheDocument()
  })

  it('does not show Low stock for Widget A (50 >= 20)', () => {
    render(<App />)
    expect(within(row('Widget A')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('shows unit price formatted as $X.XX', () => {
    render(<App />)
    expect(within(row('Widget A')).getByText(/\$4\.99/)).toBeInTheDocument()
    expect(within(row('Gadget B')).getByText(/\$12\.50/)).toBeInTheDocument()
  })

  it('adds a new product and it appears in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Sprocket D', '25', '10', '3.00')
    expect(screen.getByText('Sprocket D')).toBeInTheDocument()
  })

  it('ignores add when name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /add product/i }))
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
  })

  it('adjusts on-hand quantity upward', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget A')).getByRole('button', { name: /adjust widget a/i }))
    await u.clear(screen.getByLabelText('Adjust qty'))
    await u.type(screen.getByLabelText('Adjust qty'), '10')
    await u.click(screen.getByRole('button', { name: /confirm adjust widget a/i }))
    expect(within(row('Widget A')).getByText(/on hand: 60/i)).toBeInTheDocument()
  })

  it('adjusts on-hand quantity downward', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Doohickey C')).getByRole('button', { name: /adjust doohickey c/i }))
    await u.clear(screen.getByLabelText('Adjust qty'))
    await u.type(screen.getByLabelText('Adjust qty'), '-20')
    await u.click(screen.getByRole('button', { name: /confirm adjust doohickey c/i }))
    expect(within(row('Doohickey C')).getByText(/on hand: 80/i)).toBeInTheDocument()
  })

  it('clamps on-hand to 0 when adjustment would go negative', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Gadget B')).getByRole('button', { name: /adjust gadget b/i }))
    await u.clear(screen.getByLabelText('Adjust qty'))
    await u.type(screen.getByLabelText('Adjust qty'), '-100')
    await u.click(screen.getByRole('button', { name: /confirm adjust gadget b/i }))
    expect(within(row('Gadget B')).getByText(/on hand: 0/i)).toBeInTheDocument()
  })

  it('low stock flag appears after adjustment drops below reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(within(row('Widget A')).queryByText('Low stock')).not.toBeInTheDocument()
    await u.click(within(row('Widget A')).getByRole('button', { name: /adjust widget a/i }))
    await u.clear(screen.getByLabelText('Adjust qty'))
    await u.type(screen.getByLabelText('Adjust qty'), '-35')
    await u.click(screen.getByRole('button', { name: /confirm adjust widget a/i }))
    expect(within(row('Widget A')).getByText('Low stock')).toBeInTheDocument()
  })

  it('removes a product', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Doohickey C')).getByRole('button', { name: /remove doohickey c/i }))
    expect(screen.queryByText('Doohickey C')).not.toBeInTheDocument()
  })

  it('filter checkbox shows only low-stock items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Show low stock only'))
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument()
    expect(screen.queryByText('Doohickey C')).not.toBeInTheDocument()
    expect(screen.getByText('Gadget B')).toBeInTheDocument()
  })

  it('unchecking filter restores full list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByLabelText('Show low stock only'))
    await u.click(screen.getByLabelText('Show low stock only'))
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getByText('Doohickey C')).toBeInTheDocument()
  })

  it('Summary shows correct total products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
  })

  it('Summary shows correct low stock items count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
  })

  it('Summary shows correct total inventory value for seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    // 50*4.99 + 8*12.50 + 100*1.75 = 249.50 + 100.00 + 175.00 = 524.50
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $524.50')).toBeInTheDocument()
  })

  it('Summary shows low stock percentage', async () => {
    const u = userEvent.setup()
    render(<App />)
    // 1 of 3 = 33%
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock: 33%')).toBeInTheDocument()
  })

  it('Summary updates after adjustment (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget A')).getByRole('button', { name: /adjust widget a/i }))
    await u.clear(screen.getByLabelText('Adjust qty'))
    await u.type(screen.getByLabelText('Adjust qty'), '-35')
    await u.click(screen.getByRole('button', { name: /confirm adjust widget a/i }))
    await nav(u, 'Summary')
    // Widget A now 15*4.99=74.85, Gadget B 8*12.50=100, Doohickey C 100*1.75=175 => 349.85
    expect(screen.getByText('Total inventory value: $349.85')).toBeInTheDocument()
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
  })

  it('theme toggle sets data-theme to dark and persists', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('Reset inventory restores seeded data', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Extra Part', '5', '2', '9.99')
    expect(screen.getByText('Extra Part')).toBeInTheDocument()
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /reset inventory/i }))
    await nav(u, 'Inventory')
    expect(screen.queryByText('Extra Part')).not.toBeInTheDocument()
    expect(screen.getByText('Widget A')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('Summary shows 0% when no products exist', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget A')).getByRole('button', { name: /remove widget a/i }))
    await u.click(within(row('Gadget B')).getByRole('button', { name: /remove gadget b/i }))
    await u.click(within(row('Doohickey C')).getByRole('button', { name: /remove doohickey c/i }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 0')).toBeInTheDocument()
    expect(screen.getByText('Low stock: 0%')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $0.00')).toBeInTheDocument()
  })
})

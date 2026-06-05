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

describe('Stock Levels Manager', () => {
  it('starts on the Inventory view', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })

  it('shows the three seeded products on load', () => {
    render(<App />)
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

  it('navigates back to Inventory view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    await nav(u, 'Inventory')
    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })

  it('shows LOW STOCK flag for Gadget B and Doohickey C on load', () => {
    render(<App />)
    const gadgetRow = row('Gadget B')
    expect(within(gadgetRow).getByText('LOW STOCK')).toBeInTheDocument()
    const doohickeyRow = row('Doohickey C')
    expect(within(doohickeyRow).getByText('LOW STOCK')).toBeInTheDocument()
  })

  it('does not show LOW STOCK for Widget A on load', () => {
    render(<App />)
    const widgetRow = row('Widget A')
    expect(within(widgetRow).queryByText('LOW STOCK')).not.toBeInTheDocument()
  })

  it('shows correct line value for Widget A', () => {
    render(<App />)
    expect(within(row('Widget A')).getByText('Value: $250.00')).toBeInTheDocument()
  })

  it('shows correct line value for Doohickey C (zero on hand)', () => {
    render(<App />)
    expect(within(row('Doohickey C')).getByText('Value: $0.00')).toBeInTheDocument()
  })

  it('increase stock button increments on hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase stock for Gadget B' }))
    expect(within(row('Gadget B')).getByText('On hand: 6')).toBeInTheDocument()
  })

  it('decrease stock button decrements on hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Decrease stock for Widget A' }))
    expect(within(row('Widget A')).getByText('On hand: 99')).toBeInTheDocument()
  })

  it('decrease stock is disabled at zero on hand', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Decrease stock for Doohickey C' })).toBeDisabled()
  })

  it('on-hand never goes below zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Doohickey C starts at 0, clicking decrease should do nothing
    const btn = screen.getByRole('button', { name: 'Decrease stock for Doohickey C' })
    expect(btn).toBeDisabled()
    expect(within(row('Doohickey C')).getByText('On hand: 0')).toBeInTheDocument()
  })

  it('removing a product takes it off the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Gadget B' }))
    expect(screen.queryByText('Gadget B')).not.toBeInTheDocument()
  })

  it('adds a new product and shows it in the list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Super Sprocket')
    await u.type(screen.getByLabelText('Unit price'), '4.50')
    await u.type(screen.getByLabelText('On hand'), '30')
    await u.type(screen.getByLabelText('Reorder point'), '10')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(screen.getByText('Super Sprocket')).toBeInTheDocument()
  })

  it('ignores add product when name is blank', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    // still only the 3 seeded items
    expect(screen.getAllByRole('listitem').length).toBe(3)
  })

  it('summary shows correct total products on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 3')).toBeInTheDocument()
  })

  it('summary shows correct low stock items on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
  })

  it('summary shows correct in stock count on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(screen.getByText('In stock: 1')).toBeInTheDocument()
  })

  it('summary shows correct total inventory value on load', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widget A: 100 * 2.50 = 250.00, Gadget B: 5 * 15.00 = 75.00, Doohickey C: 0 * 7.99 = 0.00 => 325.00
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $325.00')).toBeInTheDocument()
  })

  it('summary updates after stock adjustment (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Increase Doohickey C from 0 to 1, adding $7.99
    await u.click(screen.getByRole('button', { name: 'Increase stock for Doohickey C' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total inventory value: $332.99')).toBeInTheDocument()
    // Now Doohickey C is at 1, still < 5 reorder point, low stock count unchanged
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
  })

  it('summary updates after removing a product (cross-view state)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Widget A' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 2')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $75.00')).toBeInTheDocument()
  })

  it('toggle theme changes data-theme attribute', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    const root = () => container.querySelector('[data-theme]')
    expect(root()).toHaveAttribute('data-theme', 'light')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
  })

  it('theme persists when navigating between views', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    await nav(u, 'Inventory')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
    await nav(u, 'Summary')
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'dark')
  })

  it('reset inventory clears all products and summary reflects zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Reset inventory' }))
    await nav(u, 'Inventory')
    expect(screen.queryByText('Widget A')).not.toBeInTheDocument()
    expect(screen.queryByText('Gadget B')).not.toBeInTheDocument()
    expect(screen.queryByText('Doohickey C')).not.toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 0')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $0.00')).toBeInTheDocument()
  })
})

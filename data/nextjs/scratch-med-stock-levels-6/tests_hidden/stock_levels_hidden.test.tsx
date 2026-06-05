// HELD-OUT generalization tests — fresh scenarios not seen during development.
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

describe('Stock Levels Manager (held-out)', () => {
  it('new product starts as low stock (0 < reorder point 10)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Sprocket')
    await u.type(screen.getByLabelText('Unit price'), '3.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(within(row('Sprocket')).getByText('Low stock')).toBeInTheDocument()
  })

  it('new product included in Summary total products count', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Cog')    
    await u.type(screen.getByLabelText('Unit price'), '1.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 4')).toBeInTheDocument()
  })

  it('removing a product updates Summary total products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(within(row('Widget A')).getByRole('button', { name: 'Remove Widget A' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 2')).toBeInTheDocument()
  })

  it('removing a product updates Summary total value', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Remove Gadget B (12 * 15.00 = 180.00); remaining: 5*2.50 + 0*7.00 = 12.50
    await u.click(within(row('Gadget B')).getByRole('button', { name: 'Remove Gadget B' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total value: $12.50')).toBeInTheDocument()
  })

  it('removing a low-stock product updates Summary low stock count', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Doohickey C is low stock (0<5); remove it
    await u.click(within(row('Doohickey C')).getByRole('button', { name: 'Remove Doohickey C' }))
    await nav(u, 'Summary')
    // Only Widget A (5<10) remains low
    expect(screen.getByText('Low stock items: 1')).toBeInTheDocument()
  })

  it('Decrease button enables after an increase', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Doohickey C starts at 0, decrease is disabled
    const dec = within(row('Doohickey C')).getByRole('button', { name: 'Decrease Doohickey C' })
    expect(dec).toBeDisabled()
    await u.click(within(row('Doohickey C')).getByRole('button', { name: 'Increase Doohickey C' }))
    expect(dec).not.toBeDisabled()
  })

  it('Gadget B does NOT show Low stock badge on load', () => {
    render(<App />)
    // Gadget B: 12 >= 8
    expect(within(row('Gadget B')).queryByText('Low stock')).not.toBeInTheDocument()
  })

  it('Gadget B shows Low stock badge when stock drops below reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Gadget B reorder = 8; need to decrease from 12 to 7 (5 times)
    for (let i = 0; i < 5; i++) {
      await u.click(within(row('Gadget B')).getByRole('button', { name: 'Decrease Gadget B' }))
    }
    expect(within(row('Gadget B')).getByText('On hand: 7')).toBeInTheDocument()
    expect(within(row('Gadget B')).getByText('Low stock')).toBeInTheDocument()
  })

  it('Summary total units updates after decrease', async () => {
    const u = userEvent.setup()
    render(<App />)
    // decrease Widget A once: 5->4; total units: 4+12+0=16
    await u.click(within(row('Widget A')).getByRole('button', { name: 'Decrease Widget A' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total units: 16')).toBeInTheDocument()
  })

  it('Summary total value accounts for new product stock adjustments', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.type(screen.getByLabelText('Product name'), 'Bolt')
    await u.type(screen.getByLabelText('Unit price'), '10.00')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    // Bolt starts at 0; increase twice => 2 units
    await u.click(within(row('Bolt')).getByRole('button', { name: 'Increase Bolt' }))
    await u.click(within(row('Bolt')).getByRole('button', { name: 'Increase Bolt' }))
    await nav(u, 'Summary')
    // 5*2.50 + 12*15 + 0*7 + 2*10 = 12.50+180+0+20 = 212.50
    expect(screen.getByText('Total value: $212.50')).toBeInTheDocument()
  })

  it('theme toggle back to light restores data-theme to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    const root = () => container.querySelector('[data-theme]')
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'dark')
    await u.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(root()).toHaveAttribute('data-theme', 'light')
  })
})

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
  it('seeded Bolts shows correct on-hand and reorder point', () => {
    render(<App />)
    expect(within(row('Bolts')).getByText('On hand: 100')).toBeInTheDocument()
    expect(within(row('Bolts')).getByText('Reorder point: 50')).toBeInTheDocument()
  })

  it('decreasing Bolts 101 times clamps to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    for (let i = 0; i < 101; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Bolts' }))
    }
    expect(within(row('Bolts')).getByText('On hand: 0')).toBeInTheDocument()
  })

  it('Bolts shows LOW STOCK once on-hand drops below reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // decrease 51 times: 100 -> 49, which is < 50
    for (let i = 0; i < 51; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Bolts' }))
    }
    expect(within(row('Bolts')).getByText('LOW STOCK')).toBeInTheDocument()
  })

  it('increasing Sprockets to exactly reorder point removes LOW STOCK flag', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Sprockets: on-hand 5, reorder 10 — increase 5 times to reach 10 (not < 10)
    for (let i = 0; i < 5; i++) {
      await u.click(screen.getByRole('button', { name: 'Increase Sprockets' }))
    }
    expect(within(row('Sprockets')).queryByText('LOW STOCK')).not.toBeInTheDocument()
  })

  it('removes all seeded products and heading shows 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Widgets' }))
    await u.click(screen.getByRole('button', { name: 'Remove Sprockets' }))
    await u.click(screen.getByRole('button', { name: 'Remove Bolts' }))
    expect(screen.getByRole('heading', { name: /products \(0\)/i })).toBeInTheDocument()
  })

  it('Summary shows zero value when all products removed', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Remove Widgets' }))
    await u.click(screen.getByRole('button', { name: 'Remove Sprockets' }))
    await u.click(screen.getByRole('button', { name: 'Remove Bolts' }))
    await nav(u, 'Summary')
    expect(screen.getByText('Total products: 0')).toBeInTheDocument()
    expect(screen.getByText('Total units on hand: 0')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $0.00')).toBeInTheDocument()
    expect(screen.getByText('Low stock items: 0')).toBeInTheDocument()
  })

  it('adds a product with zero on-hand and it shows LOW STOCK when reorder > 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Product name'))
    await u.type(screen.getByLabelText('Product name'), 'Nuts')
    await u.clear(screen.getByLabelText('On hand'))
    await u.type(screen.getByLabelText('On hand'), '0')
    await u.clear(screen.getByLabelText('Reorder point'))
    await u.type(screen.getByLabelText('Reorder point'), '5')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    expect(within(row('Nuts')).getByText('LOW STOCK')).toBeInTheDocument()
  })

  it('Summary value updates correctly after adding a new product', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.clear(screen.getByLabelText('Product name'))
    await u.type(screen.getByLabelText('Product name'), 'Caps')
    await u.clear(screen.getByLabelText('On hand'))
    await u.type(screen.getByLabelText('On hand'), '10')
    await u.clear(screen.getByLabelText('Reorder point'))
    await u.type(screen.getByLabelText('Reorder point'), '5')
    await u.click(screen.getByRole('button', { name: 'Add product' }))
    await nav(u, 'Summary')
    // 30 + 5 + 100 + 10 = 145; 145 * 2.50 = 362.50
    expect(screen.getByText('Total units on hand: 145')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $362.50')).toBeInTheDocument()
    expect(screen.getByText('Total products: 4')).toBeInTheDocument()
  })

  it('low stock items count increases when decreasing Widgets below reorder point', async () => {
    const u = userEvent.setup()
    render(<App />)
    // Widgets: on-hand 30, reorder 20 — decrease 11 times => on-hand 19
    for (let i = 0; i < 11; i++) {
      await u.click(screen.getByRole('button', { name: 'Decrease Widgets' }))
    }
    await nav(u, 'Summary')
    expect(screen.getByText('Low stock items: 2')).toBeInTheDocument()
  })

  it('toggling theme twice returns to light', async () => {
    const u = userEvent.setup()
    const { container } = render(<App />)
    await nav(u, 'Settings')
    await u.click(screen.getByRole('button', { name: 'Toggle theme' }))
    await u.click(screen.getByRole('button', { name: 'Toggle theme' }))
    expect(container.querySelector('[data-theme]')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
  })

  it('Summary total units reflect multiple increases across different products', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'Increase Widgets' }))
    await u.click(screen.getByRole('button', { name: 'Increase Widgets' }))
    await u.click(screen.getByRole('button', { name: 'Increase Bolts' }))
    await nav(u, 'Summary')
    // 32 + 5 + 101 = 138; 138 * 2.50 = 345.00
    expect(screen.getByText('Total units on hand: 138')).toBeInTheDocument()
    expect(screen.getByText('Total inventory value: $345.00')).toBeInTheDocument()
  })
})

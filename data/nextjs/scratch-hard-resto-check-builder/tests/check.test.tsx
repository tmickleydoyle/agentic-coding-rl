import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, price: string) {
  await u.clear(screen.getByLabelText(/^name$/i))
  await u.type(screen.getByLabelText(/^name$/i), name)
  await u.clear(screen.getByLabelText(/^price$/i))
  await u.type(screen.getByLabelText(/^price$/i), price)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}
async function addLine(u: U, name: string, qty: string) {
  await u.selectOptions(screen.getByLabelText(/^item$/i), name)
  await u.clear(screen.getByLabelText(/quantity/i))
  await u.type(screen.getByLabelText(/quantity/i), qty)
  await u.click(screen.getByRole('button', { name: /add to check/i }))
}
async function setDiscount(u: U, v: string) {
  await u.clear(screen.getByLabelText(/discount %/i))
  if (v !== '') await u.type(screen.getByLabelText(/discount %/i), v)
}
const items = () => screen.getByRole('region', { name: 'Items view' })
const check = () => screen.getByRole('region', { name: 'Check view' })
const summary = () => screen.getByRole('region', { name: 'Summary view' })

describe('Guest check builder', () => {
  it('starts on Items', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Items' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Check')
    expect(screen.getByRole('heading', { name: 'Check' })).toBeInTheDocument()
    await nav(u, 'Summary')
    expect(screen.getByRole('heading', { name: 'Summary' })).toBeInTheDocument()
    await nav(u, 'Items')
    expect(screen.getByRole('heading', { name: 'Items' })).toBeInTheDocument()
  })

  it('adds a menu item with two-decimal price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Soup', '6.5')
    expect(within(items()).getByText('Soup — $6.50')).toBeInTheDocument()
  })

  it('ignores a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, '   ', '5')
    expect(within(items()).queryByText(/\$5\.00/)).not.toBeInTheDocument()
  })

  it('ignores a non-positive price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Free', '0')
    expect(within(items()).queryByText(/Free/)).not.toBeInTheDocument()
  })

  it('starts with an empty menu', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Items' })).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('adds a check line with a computed line total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Soup', '6.5')
    await nav(u, 'Check')
    await addLine(u, 'Soup', '2')
    expect(within(check()).getByText('2 × Soup — $13.00')).toBeInTheDocument()
  })

  it('shows a running subtotal on Check', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Soup', '6.5')
    await addItem(u, 'Pie', '4')
    await nav(u, 'Check')
    await addLine(u, 'Soup', '2')
    await addLine(u, 'Pie', '1')
    expect(within(check()).getByText('Subtotal: $17.00')).toBeInTheDocument()
  })

  it('ignores a fractional quantity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Soup', '6.5')
    await nav(u, 'Check')
    await addLine(u, 'Soup', '1.5')
    expect(within(check()).getByText('Subtotal: $0.00')).toBeInTheDocument()
  })

  it('does nothing when adding a line with no menu items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Check')
    await u.type(screen.getByLabelText(/quantity/i), '2')
    await u.click(screen.getByRole('button', { name: /add to check/i }))
    expect(within(check()).getByText('Subtotal: $0.00')).toBeInTheDocument()
  })

  it('summarizes with no discount', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Soup', '6.5')
    await nav(u, 'Check')
    await addLine(u, 'Soup', '2') // subtotal 13.00
    await nav(u, 'Summary')
    expect(within(summary()).getByText('Subtotal: $13.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Discount: -$0.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Taxable: $13.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Tax: $1.30')).toBeInTheDocument()
    expect(within(summary()).getByText('Total: $14.30')).toBeInTheDocument()
  })

  it('applies a percent discount before tax', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Soup', '6.5')
    await nav(u, 'Check')
    await addLine(u, 'Soup', '2') // subtotal 13.00
    await setDiscount(u, '10')
    await nav(u, 'Summary')
    expect(within(summary()).getByText('Subtotal: $13.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Discount: -$1.30')).toBeInTheDocument()
    expect(within(summary()).getByText('Taxable: $11.70')).toBeInTheDocument()
    expect(within(summary()).getByText('Tax: $1.17')).toBeInTheDocument()
    expect(within(summary()).getByText('Total: $12.87')).toBeInTheDocument()
  })

  it('treats an empty discount as zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Soup', '6.5')
    await nav(u, 'Check')
    await addLine(u, 'Soup', '2')
    await setDiscount(u, '') // cleared
    await nav(u, 'Summary')
    expect(within(summary()).getByText('Discount: -$0.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Total: $14.30')).toBeInTheDocument()
  })

  it('clamps a discount above 100 to 100', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Soup', '6.5')
    await nav(u, 'Check')
    await addLine(u, 'Soup', '2')
    await setDiscount(u, '150')
    await nav(u, 'Summary')
    expect(within(summary()).getByText('Discount: -$13.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Taxable: $0.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('shows all zeros on an empty check', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Summary')
    expect(within(summary()).getByText('Subtotal: $0.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Total: $0.00')).toBeInTheDocument()
  })

  it('shares menu items with the Check item selector', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Taco', '3')
    await nav(u, 'Check')
    expect(within(check()).getByRole('option', { name: 'Taco' })).toBeInTheDocument()
  })

  it('reflects discount changes live in the Summary total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Plate', '10')
    await nav(u, 'Check')
    await addLine(u, 'Plate', '1') // subtotal 10.00
    await setDiscount(u, '50') // taxable 5.00, tax .50, total 5.50
    await nav(u, 'Summary')
    expect(within(summary()).getByText('Total: $5.50')).toBeInTheDocument()
  })
})

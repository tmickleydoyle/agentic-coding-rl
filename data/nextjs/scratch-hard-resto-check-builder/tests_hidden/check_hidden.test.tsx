// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
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
  await u.type(screen.getByLabelText(/discount %/i), v)
}
const summary = () => screen.getByRole('region', { name: 'Summary view' })

describe('Guest check (held-out)', () => {
  it('rounds tax to the nearest cent', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Item', '9.99')
    await nav(u, 'Check')
    await addLine(u, 'Item', '1') // subtotal 9.99, tax 0.999 -> 1.00
    await nav(u, 'Summary')
    expect(within(summary()).getByText('Tax: $1.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Total: $10.99')).toBeInTheDocument()
  })

  it('combines a discount and tax across multiple items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A', '8')
    await addItem(u, 'B', '12')
    await nav(u, 'Check')
    await addLine(u, 'A', '2') // 16
    await addLine(u, 'B', '1') // 12 -> subtotal 28
    await setDiscount(u, '25') // discount 7, taxable 21, tax 2.10, total 23.10
    await nav(u, 'Summary')
    expect(within(summary()).getByText('Subtotal: $28.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Discount: -$7.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Taxable: $21.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Total: $23.10')).toBeInTheDocument()
  })

  it('a zero discount yields subtotal equal to taxable', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A', '5')
    await nav(u, 'Check')
    await addLine(u, 'A', '3') // 15
    await setDiscount(u, '0')
    await nav(u, 'Summary')
    expect(within(summary()).getByText('Taxable: $15.00')).toBeInTheDocument()
    expect(within(summary()).getByText('Total: $16.50')).toBeInTheDocument()
  })
})

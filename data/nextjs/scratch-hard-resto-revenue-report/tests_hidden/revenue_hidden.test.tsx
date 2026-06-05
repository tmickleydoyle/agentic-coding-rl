// HELD-OUT generalization tests — overlaid only at eval, never seen by the agent.
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addDish(u: U, name: string, price: string) {
  await u.clear(screen.getByLabelText(/dish name/i))
  await u.type(screen.getByLabelText(/dish name/i), name)
  await u.clear(screen.getByLabelText(/price/i))
  await u.type(screen.getByLabelText(/price/i), price)
  await u.click(screen.getByRole('button', { name: /add dish/i }))
}
async function addOrder(u: U, dish: string, qty: string) {
  await u.selectOptions(screen.getByLabelText(/^dish$/i), dish)
  await u.clear(screen.getByLabelText(/quantity/i))
  await u.type(screen.getByLabelText(/quantity/i), qty)
  await u.click(screen.getByRole('button', { name: /add to order/i }))
}
const revenue = () => screen.getByRole('region', { name: 'Revenue view' })

describe('Restaurant revenue (held-out)', () => {
  it('breaks a revenue tie alphabetically by dish name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Ziti', '10')
    await addDish(u, 'Apple', '10')
    await nav(u, 'Orders')
    await addOrder(u, 'Ziti', '2') // 20
    await addOrder(u, 'Apple', '2') // 20
    await nav(u, 'Revenue')
    const items = within(revenue()).getAllByRole('listitem').map((li) => li.textContent)
    expect(items[0]).toBe('Apple: $20 (2 sold)')
    expect(items[1]).toBe('Ziti: $20 (2 sold)')
  })

  it('accumulates quantity sold across separate tickets of the same dish', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Pie', '5')
    await nav(u, 'Orders')
    await addOrder(u, 'Pie', '2')
    await addOrder(u, 'Pie', '4')
    await nav(u, 'Revenue')
    expect(within(revenue()).getByText('Pie: $30 (6 sold)')).toBeInTheDocument()
  })

  it('top seller follows revenue, not quantity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Cheap', '1')
    await addDish(u, 'Pricey', '50')
    await nav(u, 'Orders')
    await addOrder(u, 'Cheap', '40') // $40, 40 sold
    await addOrder(u, 'Pricey', '1') // $50, 1 sold
    await nav(u, 'Revenue')
    expect(within(revenue()).getByText('Top seller: Pricey')).toBeInTheDocument()
  })
})

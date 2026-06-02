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

const orders = () => screen.getByRole('region', { name: 'Orders view' })
const revenue = () => screen.getByRole('region', { name: 'Revenue view' })

describe('Restaurant revenue app', () => {
  it('starts on Menu', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Orders')
    expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument()
    await nav(u, 'Revenue')
    expect(screen.getByRole('heading', { name: 'Revenue' })).toBeInTheDocument()
    await nav(u, 'Menu')
    expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument()
  })

  it('adds a dish to the menu', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Burger', '9')
    expect(screen.getByText('Burger - $9')).toBeInTheDocument()
  })

  it('ignores a blank dish name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, '   ', '5')
    expect(screen.queryByText(/\$5/)).not.toBeInTheDocument()
  })

  it('ignores a non-positive price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Free', '0')
    expect(screen.queryByText(/Free/)).not.toBeInTheDocument()
  })

  it('starts with an empty menu under the Menu heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Menu' })).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('places a ticket with a line total (cross-view price)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Burger', '9')
    await nav(u, 'Orders')
    await addOrder(u, 'Burger', '3')
    expect(within(orders()).getByText('3 × Burger = $27')).toBeInTheDocument()
  })

  it('sums the order total across tickets', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Burger', '9')
    await addDish(u, 'Fries', '4')
    await nav(u, 'Orders')
    await addOrder(u, 'Burger', '2')
    await addOrder(u, 'Fries', '3')
    expect(within(orders()).getByText('Order total: $30')).toBeInTheDocument()
  })

  it('ignores a fractional quantity', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Burger', '9')
    await nav(u, 'Orders')
    await addOrder(u, 'Burger', '1.5')
    expect(within(orders()).getByText('Order total: $0')).toBeInTheDocument()
  })

  it('ignores a quantity below one', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Burger', '9')
    await nav(u, 'Orders')
    await addOrder(u, 'Burger', '0')
    expect(within(orders()).getByText('Order total: $0')).toBeInTheDocument()
  })

  it('aggregates revenue per ordered dish', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Burger', '9')
    await nav(u, 'Orders')
    await addOrder(u, 'Burger', '3')
    await addOrder(u, 'Burger', '1')
    await nav(u, 'Revenue')
    expect(within(revenue()).getByText('Burger: $36 (4 sold)')).toBeInTheDocument()
  })

  it('omits dishes that were never ordered from Revenue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Burger', '9')
    await addDish(u, 'Soup', '6')
    await nav(u, 'Orders')
    await addOrder(u, 'Burger', '1')
    await nav(u, 'Revenue')
    expect(within(revenue()).getByText('Burger: $9 (1 sold)')).toBeInTheDocument()
    expect(within(revenue()).queryByText(/Soup:/)).not.toBeInTheDocument()
  })

  it('sorts Revenue by money descending', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Burger', '9')
    await addDish(u, 'Soup', '6')
    await nav(u, 'Orders')
    await addOrder(u, 'Soup', '5') // 30
    await addOrder(u, 'Burger', '9') // 81
    await nav(u, 'Revenue')
    const items = within(revenue()).getAllByRole('listitem').map((li) => li.textContent)
    expect(items[0]).toBe('Burger: $81 (9 sold)')
    expect(items[1]).toBe('Soup: $30 (5 sold)')
  })

  it('names the top seller by revenue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Burger', '9')
    await addDish(u, 'Soup', '6')
    await nav(u, 'Orders')
    await addOrder(u, 'Soup', '5')
    await addOrder(u, 'Burger', '9')
    await nav(u, 'Revenue')
    expect(within(revenue()).getByText('Top seller: Burger')).toBeInTheDocument()
  })

  it('shows Top seller: none before anything is ordered', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Revenue')
    expect(within(revenue()).getByText('Top seller: none')).toBeInTheDocument()
  })

  it('shares menu edits with the Orders dish selector', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addDish(u, 'Taco', '5')
    await nav(u, 'Orders')
    expect(within(orders()).getByRole('option', { name: 'Taco' })).toBeInTheDocument()
  })

  it('does nothing when ordering with no dishes', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Orders')
    await u.type(screen.getByLabelText(/quantity/i), '3')
    await u.click(screen.getByRole('button', { name: /add to order/i }))
    expect(within(orders()).getByText('Order total: $0')).toBeInTheDocument()
  })
})

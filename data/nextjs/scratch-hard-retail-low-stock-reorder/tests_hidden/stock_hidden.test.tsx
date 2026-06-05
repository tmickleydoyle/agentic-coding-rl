import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addItem(u: U, name: string, onHand = '0', reorder = '0', target = '0') {
  await nav(u, 'Inventory')
  await u.clear(screen.getByLabelText(/item name/i))
  await u.type(screen.getByLabelText(/item name/i), name)
  await u.clear(screen.getByLabelText(/on hand/i))
  if (onHand) await u.type(screen.getByLabelText(/on hand/i), onHand)
  await u.clear(screen.getByLabelText(/reorder level/i))
  if (reorder) await u.type(screen.getByLabelText(/reorder level/i), reorder)
  await u.clear(screen.getByLabelText(/^target$/i))
  if (target) await u.type(screen.getByLabelText(/^target$/i), target)
  await u.click(screen.getByRole('button', { name: /add item/i }))
}

async function sell(u: U, itemName: string, amount: string) {
  await nav(u, 'Restock')
  await u.selectOptions(screen.getByLabelText(/^item$/i), itemName)
  await u.clear(screen.getByLabelText(/^reduce$/i))
  if (amount) await u.type(screen.getByLabelText(/^reduce$/i), amount)
  await u.click(screen.getByRole('button', { name: /^sell$/i }))
}

describe('Low-stock hidden suite', () => {
  it('selling into the low zone adds the item to reorder', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Drift', '8', '5', '15')
    await nav(u, 'Report')
    expect(screen.getByText('Items low: 0')).toBeInTheDocument()
    await sell(u, 'Drift', '4') // on hand 4 <= 5
    await nav(u, 'Report')
    expect(screen.getByText('Items low: 1')).toBeInTheDocument()
    expect(screen.getByText('Reorder Drift: buy 11')).toBeInTheDocument()
    expect(screen.getByText('Total to reorder: 11')).toBeInTheDocument()
  })

  it('a zero-reorder item is low only at zero on hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Edge', '1', '0', '10')
    await nav(u, 'Report')
    expect(screen.getByText('Items low: 0')).toBeInTheDocument()
    await sell(u, 'Edge', '1')
    await nav(u, 'Report')
    expect(screen.getByText('Items low: 1')).toBeInTheDocument()
    expect(screen.getByText('Reorder Edge: buy 10')).toBeInTheDocument()
  })

  it('handles several low items with a combined total', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'X', '0', '4', '4') // buy 4
    await addItem(u, 'Y', '2', '4', '9') // buy 7
    await addItem(u, 'Z', '4', '4', '4') // low, buy 0
    await nav(u, 'Report')
    expect(screen.getByText('Items low: 3')).toBeInTheDocument()
    expect(screen.getByText('Reorder Z: buy 0')).toBeInTheDocument()
    expect(screen.getByText('Total to reorder: 11')).toBeInTheDocument()
  })
})

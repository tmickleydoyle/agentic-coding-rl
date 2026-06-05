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

async function receive(u: U, itemName: string, amount: string) {
  await nav(u, 'Restock')
  await u.selectOptions(screen.getByLabelText(/^item$/i), itemName)
  await u.clear(screen.getByLabelText(/^receive$/i))
  if (amount) await u.type(screen.getByLabelText(/^receive$/i), amount)
  await u.click(screen.getByRole('button', { name: /receive stock/i }))
}

async function sell(u: U, itemName: string, amount: string) {
  await nav(u, 'Restock')
  await u.selectOptions(screen.getByLabelText(/^item$/i), itemName)
  await u.clear(screen.getByLabelText(/^reduce$/i))
  if (amount) await u.type(screen.getByLabelText(/^reduce$/i), amount)
  await u.click(screen.getByRole('button', { name: /^sell$/i }))
}

describe('Low-stock reorder app', () => {
  it('starts on Inventory', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Restock')
    expect(screen.getByRole('heading', { name: 'Restock' })).toBeInTheDocument()
    await nav(u, 'Report')
    expect(screen.getByRole('heading', { name: 'Report' })).toBeInTheDocument()
    await nav(u, 'Inventory')
    expect(screen.getByRole('heading', { name: 'Inventory' })).toBeInTheDocument()
  })

  it('adds an item with its on-hand and reorder line', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Nails', '50', '10', '80')
    expect(screen.getByText('Nails: On hand 50 (reorder at 10)')).toBeInTheDocument()
  })

  it('ignores an item with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Inventory')
    await u.type(screen.getByLabelText(/on hand/i), '5')
    await u.click(screen.getByRole('button', { name: /add item/i }))
    expect(screen.queryByText(/On hand 5/)).not.toBeInTheDocument()
  })

  it('defaults blank or negative numbers to 0 and rounds down', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Blanky', '', '-3', '7.9')
    expect(screen.getByText('Blanky: On hand 0 (reorder at 0) LOW')).toBeInTheDocument()
  })

  it('marks an item LOW when on hand is at or below the reorder level', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Screws', '10', '10', '40')
    expect(screen.getByText('Screws: On hand 10 (reorder at 10) LOW')).toBeInTheDocument()
  })

  it('does not mark an item LOW when on hand is above the reorder level', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Bolts', '11', '10', '40')
    expect(screen.getByText('Bolts: On hand 11 (reorder at 10)')).toBeInTheDocument()
    expect(screen.queryByText(/Bolts.*LOW/)).not.toBeInTheDocument()
  })

  it('receives stock and increases on hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Tape', '5', '10', '30')
    await receive(u, 'Tape', '20')
    await nav(u, 'Inventory')
    expect(screen.getByText('Tape: On hand 25 (reorder at 10)')).toBeInTheDocument()
  })

  it('ignores a receive amount below 1 and rounds down', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Glue', '5', '2', '20')
    await receive(u, 'Glue', '0')
    await nav(u, 'Inventory')
    expect(screen.getByText('Glue: On hand 5 (reorder at 2)')).toBeInTheDocument()
    await receive(u, 'Glue', '3.8')
    await nav(u, 'Inventory')
    expect(screen.getByText('Glue: On hand 8 (reorder at 2)')).toBeInTheDocument()
  })

  it('sells stock but never below zero', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Washers', '4', '2', '20')
    await sell(u, 'Washers', '10')
    await nav(u, 'Inventory')
    expect(screen.getByText('Washers: On hand 0 (reorder at 2) LOW')).toBeInTheDocument()
  })

  it('counts how many items are low', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'A', '1', '5', '10')
    await addItem(u, 'B', '9', '5', '10')
    await addItem(u, 'C', '0', '5', '10')
    await nav(u, 'Report')
    expect(screen.getByText('Items low: 2')).toBeInTheDocument()
  })

  it('lists a reorder line for each low item buying up to target', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Hinge', '2', '5', '12')
    await nav(u, 'Report')
    expect(screen.getByText('Reorder Hinge: buy 10')).toBeInTheDocument()
  })

  it('never buys a negative amount when target is below on hand', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Odd', '5', '5', '3')
    await nav(u, 'Report')
    expect(screen.getByText('Reorder Odd: buy 0')).toBeInTheDocument()
  })

  it('omits non-low items from the reorder list', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Plenty', '100', '5', '120')
    await nav(u, 'Report')
    expect(screen.queryByText(/Reorder Plenty/)).not.toBeInTheDocument()
  })

  it('totals the reorder quantity across low items', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'P', '2', '5', '10') // buy 8
    await addItem(u, 'Q', '0', '3', '5') // buy 5
    await addItem(u, 'R', '50', '5', '60') // not low
    await nav(u, 'Report')
    expect(screen.getByText('Total to reorder: 13')).toBeInTheDocument()
  })

  it('updates low status after receiving enough stock', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Recover', '1', '5', '20')
    await nav(u, 'Report')
    expect(screen.getByText('Items low: 1')).toBeInTheDocument()
    await receive(u, 'Recover', '10')
    await nav(u, 'Report')
    expect(screen.getByText('Items low: 0')).toBeInTheDocument()
    expect(screen.getByText('Total to reorder: 0')).toBeInTheDocument()
  })

  it('keeps items when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Sticky', '3', '5', '10')
    await nav(u, 'Report')
    await nav(u, 'Inventory')
    expect(screen.getByText('Sticky: On hand 3 (reorder at 5) LOW')).toBeInTheDocument()
  })

  it('ignores a receive when no item is selected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addItem(u, 'Solo', '5', '2', '20')
    await nav(u, 'Restock')
    await u.type(screen.getByLabelText(/^receive$/i), '5')
    await u.click(screen.getByRole('button', { name: /receive stock/i }))
    await nav(u, 'Inventory')
    expect(screen.getByText('Solo: On hand 5 (reorder at 2)')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>
const nav = (u: U, name: string) => u.click(screen.getByRole('button', { name }))

async function addProduct(u: U, name: string, price = '0') {
  await nav(u, 'Products')
  await u.clear(screen.getByLabelText(/product name/i))
  await u.type(screen.getByLabelText(/product name/i), name)
  await u.clear(screen.getByLabelText(/unit price/i))
  if (price) await u.type(screen.getByLabelText(/unit price/i), price)
  await u.click(screen.getByRole('button', { name: /add product/i }))
}

async function recordSale(u: U, productName: string, qty: string) {
  await nav(u, 'Sales')
  await u.selectOptions(screen.getByLabelText(/^product$/i), productName)
  await u.clear(screen.getByLabelText(/quantity/i))
  if (qty) await u.type(screen.getByLabelText(/quantity/i), qty)
  await u.click(screen.getByRole('button', { name: /record sale/i }))
}

describe('Sales-by-product hidden suite', () => {
  it('ignores a sale when no product is selected', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Widget', '5')
    await nav(u, 'Sales')
    await u.type(screen.getByLabelText(/quantity/i), '3')
    await u.click(screen.getByRole('button', { name: /record sale/i }))
    await nav(u, 'Report')
    expect(screen.getByText('Total revenue: $0')).toBeInTheDocument()
  })

  it('handles a large multi-product report end to end', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Alpha', '3')
    await addProduct(u, 'Beta', '4')
    await addProduct(u, 'Gamma', '2')
    await recordSale(u, 'Alpha', '2') // 6
    await recordSale(u, 'Alpha', '4') // 12 -> Alpha 6 units 18
    await recordSale(u, 'Beta', '5') // 20
    await recordSale(u, 'Gamma', '1') // 2
    await nav(u, 'Report')
    expect(screen.getByText('Alpha: 6 units, $18')).toBeInTheDocument()
    expect(screen.getByText('Beta: 5 units, $20')).toBeInTheDocument()
    expect(screen.getByText('Gamma: 1 units, $2')).toBeInTheDocument()
    expect(screen.getByText('Total revenue: $40')).toBeInTheDocument()
    expect(screen.getByText('Top product: Beta')).toBeInTheDocument()
  })

  it('updates the top product as revenue shifts', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'One', '5')
    await addProduct(u, 'Two', '5')
    await recordSale(u, 'One', '2') // One 10
    await nav(u, 'Report')
    expect(screen.getByText('Top product: One')).toBeInTheDocument()
    await recordSale(u, 'Two', '5') // Two 25
    await nav(u, 'Report')
    expect(screen.getByText('Top product: Two')).toBeInTheDocument()
  })

  it('a zero-price product contributes units but no revenue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Sample', '')
    await recordSale(u, 'Sample', '7')
    await nav(u, 'Report')
    expect(screen.getByText('Sample: 7 units, $0')).toBeInTheDocument()
    expect(screen.getByText('Total revenue: $0')).toBeInTheDocument()
    expect(screen.getByText('Top product: none')).toBeInTheDocument()
  })
})

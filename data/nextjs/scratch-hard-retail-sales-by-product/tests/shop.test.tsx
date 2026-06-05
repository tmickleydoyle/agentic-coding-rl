import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
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

describe('Sales-by-product shop app', () => {
  it('starts on Products', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()
  })

  it('navigates to every view', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Sales')
    expect(screen.getByRole('heading', { name: 'Sales' })).toBeInTheDocument()
    await nav(u, 'Report')
    expect(screen.getByRole('heading', { name: 'Report' })).toBeInTheDocument()
    await nav(u, 'Products')
    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()
  })

  it('adds a product rendered as Name @ $Price', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Apple', '2')
    expect(screen.getByText('Apple @ $2')).toBeInTheDocument()
  })

  it('ignores a product with a blank name', async () => {
    const u = userEvent.setup()
    render(<App />)
    await nav(u, 'Products')
    await u.type(screen.getByLabelText(/unit price/i), '5')
    await u.click(screen.getByRole('button', { name: /add product/i }))
    expect(screen.queryByText(/@ \$5/)).not.toBeInTheDocument()
  })

  it('defaults a blank or negative price to 0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Freebie', '')
    expect(screen.getByText('Freebie @ $0')).toBeInTheDocument()
    await addProduct(u, 'Bad', '-9')
    expect(screen.getByText('Bad @ $0')).toBeInTheDocument()
  })

  it('records a sale rendered as Name x Qty = $LineTotal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Banana', '3')
    await recordSale(u, 'Banana', '4')
    expect(screen.getByText('Banana x 4 = $12')).toBeInTheDocument()
  })

  it('captures the price at sale time even if the catalog is unchanged', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Milk', '5')
    await recordSale(u, 'Milk', '2')
    expect(screen.getByText('Milk x 2 = $10')).toBeInTheDocument()
  })

  it('ignores a sale with quantity below 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Egg', '1')
    await recordSale(u, 'Egg', '0')
    await nav(u, 'Sales')
    expect(screen.queryByText(/Egg x/)).not.toBeInTheDocument()
  })

  it('rounds a fractional quantity down to a whole number', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Rope', '10')
    await recordSale(u, 'Rope', '2.9')
    expect(screen.getByText('Rope x 2 = $20')).toBeInTheDocument()
  })

  it('reports units and revenue per product', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Soda', '2')
    await addProduct(u, 'Chips', '3')
    await recordSale(u, 'Soda', '5')
    await recordSale(u, 'Chips', '2')
    await nav(u, 'Report')
    expect(screen.getByText('Soda: 5 units, $10')).toBeInTheDocument()
    expect(screen.getByText('Chips: 2 units, $6')).toBeInTheDocument()
  })

  it('shows a product with no sales as 0 units, $0', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Dusty', '99')
    await nav(u, 'Report')
    expect(screen.getByText('Dusty: 0 units, $0')).toBeInTheDocument()
  })

  it('sums multiple sales of the same product', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Coffee', '4')
    await recordSale(u, 'Coffee', '3')
    await recordSale(u, 'Coffee', '2')
    await nav(u, 'Report')
    expect(screen.getByText('Coffee: 5 units, $20')).toBeInTheDocument()
  })

  it('computes total revenue across all sales', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Pen', '2')
    await addProduct(u, 'Mug', '7')
    await recordSale(u, 'Pen', '3')
    await recordSale(u, 'Mug', '1')
    await nav(u, 'Report')
    expect(screen.getByText('Total revenue: $13')).toBeInTheDocument()
  })

  it('names the top product by revenue', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Cheap', '1')
    await addProduct(u, 'Pricey', '50')
    await recordSale(u, 'Cheap', '5')
    await recordSale(u, 'Pricey', '1')
    await nav(u, 'Report')
    expect(screen.getByText('Top product: Pricey')).toBeInTheDocument()
  })

  it('breaks a revenue tie in favor of the product added first', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'First', '10')
    await addProduct(u, 'Second', '10')
    await recordSale(u, 'First', '1')
    await recordSale(u, 'Second', '1')
    await nav(u, 'Report')
    expect(screen.getByText('Top product: First')).toBeInTheDocument()
  })

  it('shows Top product none and zero total before any sale', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Lonely', '5')
    await nav(u, 'Report')
    expect(screen.getByText('Top product: none')).toBeInTheDocument()
    expect(screen.getByText('Total revenue: $0')).toBeInTheDocument()
  })

  it('keeps products and sales when navigating away and back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Sticky', '8')
    await recordSale(u, 'Sticky', '2')
    await nav(u, 'Report')
    await nav(u, 'Products')
    expect(screen.getByText('Sticky @ $8')).toBeInTheDocument()
    await nav(u, 'Sales')
    expect(screen.getByText('Sticky x 2 = $16')).toBeInTheDocument()
  })

  it('lets two different products both appear in the report', async () => {
    const u = userEvent.setup()
    render(<App />)
    await addProduct(u, 'Tea', '2')
    await addProduct(u, 'Cake', '6')
    await recordSale(u, 'Tea', '10')
    await recordSale(u, 'Cake', '3')
    await nav(u, 'Report')
    expect(screen.getByText('Tea: 10 units, $20')).toBeInTheDocument()
    expect(screen.getByText('Cake: 3 units, $18')).toBeInTheDocument()
    expect(screen.getByText('Total revenue: $38')).toBeInTheDocument()
    expect(screen.getByText('Top product: Tea')).toBeInTheDocument()
  })
})

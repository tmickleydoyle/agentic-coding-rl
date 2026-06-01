import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('products', () => {
  it('lists seeded products with price and stock', () => {
    render(<App />)
    expect(screen.getByTestId('product-p1-name')).toHaveTextContent('Mug')
    expect(screen.getByTestId('product-p1-price')).toHaveTextContent('12')
    expect(screen.getByTestId('product-p1-stock')).toHaveTextContent('100')
  })

  it('adds a product and shows it on the products page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.type(screen.getByTestId('name-input'), 'Hat')
    await user.type(screen.getByTestId('price-input'), '18')
    await user.type(screen.getByTestId('stock-input'), '7')
    await user.click(screen.getByTestId('submit-product'))
    expect(screen.getByTestId('page-products')).toBeInTheDocument()
    expect(screen.getByTestId('product-p4-name')).toHaveTextContent('Hat')
    expect(screen.getByTestId('product-p4-stock')).toHaveTextContent('7')
  })

  it('blocks adding a product without a name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    await user.click(screen.getByTestId('submit-product'))
    expect(screen.getByTestId('form-error')).toBeInTheDocument()
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })
})

describe('orders', () => {
  it('lists orders with fulfilled state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('order-o1')).toHaveAttribute('data-fulfilled', 'true')
    expect(screen.getByTestId('order-o2')).toHaveAttribute('data-fulfilled', 'false')
    expect(screen.getByTestId('order-o1-product')).toHaveTextContent('Mug')
  })

  it('shows a done marker for fulfilled orders and a button for pending ones', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('order-o1-done')).toBeInTheDocument()
    expect(screen.queryByTestId('fulfill-o1')).not.toBeInTheDocument()
    expect(screen.getByTestId('fulfill-o2')).toBeInTheDocument()
  })

  it('marks an order fulfilled', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-orders'))
    await user.click(screen.getByTestId('fulfill-o2'))
    expect(screen.getByTestId('order-o2')).toHaveAttribute('data-fulfilled', 'true')
    expect(screen.queryByTestId('fulfill-o2')).not.toBeInTheDocument()
    expect(screen.getByTestId('order-o2-done')).toBeInTheDocument()
  })
})

describe('revenue rollup', () => {
  it('shows total revenue and pending count from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-revenue'))
    // only o1 fulfilled: p1 price 12 * qty 2 = 24
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('24')
    expect(screen.getByTestId('pending-count')).toHaveTextContent('2')
  })

  it('breaks revenue down per product', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-revenue'))
    expect(screen.getByTestId('rev-p1-value')).toHaveTextContent('24')
    expect(screen.getByTestId('rev-p2-value')).toHaveTextContent('0')
    expect(screen.getByTestId('rev-p3-value')).toHaveTextContent('0')
  })

  it('updates revenue after fulfilling an order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-orders'))
    await user.click(screen.getByTestId('fulfill-o2')) // p2 price 25 * qty 1 = 25
    await user.click(screen.getByTestId('nav-revenue'))
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('49')
    expect(screen.getByTestId('pending-count')).toHaveTextContent('1')
    expect(screen.getByTestId('rev-p2-value')).toHaveTextContent('25')
  })

  it('updates revenue after fulfilling a second p1 order', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-orders'))
    await user.click(screen.getByTestId('fulfill-o3')) // p1 price 12 * qty 3 = 36
    await user.click(screen.getByTestId('nav-revenue'))
    expect(screen.getByTestId('rev-p1-value')).toHaveTextContent('60') // 24 + 36
    expect(screen.getByTestId('total-revenue')).toHaveTextContent('60')
  })
})

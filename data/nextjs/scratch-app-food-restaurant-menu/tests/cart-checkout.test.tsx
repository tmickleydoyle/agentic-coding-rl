import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('cart flow', () => {
  it('adds a dish to the cart and updates the badge', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d1'))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
    await user.click(screen.getByTestId('add-d1'))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('2')
  })

  it('shows the cart-empty state initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-cart'))
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('cart-lines')).not.toBeInTheDocument()
  })

  it('computes subtotal, tax, and total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d1')) // Bruschetta 8
    await user.click(screen.getByTestId('add-d4')) // Ribeye 28
    await user.click(screen.getByTestId('nav-cart'))
    // subtotal 36, tax 3.6, total 39.6
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('36')
    expect(screen.getByTestId('cart-tax')).toHaveTextContent('3.6')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('39.6')
  })

  it('increments and decrements a line quantity', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d3'))
    await user.click(screen.getByTestId('nav-cart'))
    expect(screen.getByTestId('line-d3-qty')).toHaveTextContent('1')
    await user.click(screen.getByTestId('inc-d3'))
    expect(screen.getByTestId('line-d3-qty')).toHaveTextContent('2')
    await user.click(screen.getByTestId('dec-d3'))
    expect(screen.getByTestId('line-d3-qty')).toHaveTextContent('1')
  })

  it('decrementing to zero removes the line', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d3'))
    await user.click(screen.getByTestId('nav-cart'))
    await user.click(screen.getByTestId('dec-d3'))
    expect(screen.queryByTestId('line-d3')).not.toBeInTheDocument()
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
  })

  it('removes a line explicitly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d1'))
    await user.click(screen.getByTestId('add-d2'))
    await user.click(screen.getByTestId('nav-cart'))
    await user.click(screen.getByTestId('remove-d1'))
    expect(screen.queryByTestId('line-d1')).not.toBeInTheDocument()
    expect(screen.getByTestId('line-d2')).toBeInTheDocument()
  })

  it('clears the whole cart', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d1'))
    await user.click(screen.getByTestId('nav-cart'))
    await user.click(screen.getByTestId('clear-cart'))
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('0')
  })
})

describe('checkout flow', () => {
  it('shows the checkout-empty state with an empty cart', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('checkout-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('place-order')).not.toBeInTheDocument()
  })

  it('shows the total on checkout', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d5')) // Tiramisu 9
    await user.click(screen.getByTestId('nav-checkout'))
    // tax 0.9 total 9.9
    expect(screen.getByTestId('checkout-total')).toHaveTextContent('9.9')
  })

  it('places an order, confirms, and empties the cart', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-d1'))
    await user.click(screen.getByTestId('nav-checkout'))
    await user.click(screen.getByTestId('place-order'))
    expect(screen.getByTestId('order-confirmed')).toBeInTheDocument()
    expect(screen.getByTestId('checkout-empty')).toBeInTheDocument()
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('0')
  })
})

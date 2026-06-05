import { describe, it, expect } from 'vitest'
import { render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('cart and checkout flow', () => {
  it('shows an empty cart message initially', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-cart'))
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
  })

  it('adds a product to the cart and updates the badge', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-s1'))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
    await user.click(screen.getByTestId('add-s1'))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('2')
  })

  it('adds from the product detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-s2'))
    await user.click(screen.getByTestId('add-to-cart'))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
  })

  it('shows line subtotals and computes totals with tax', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-s2')) // 30
    await user.click(screen.getByTestId('add-s2')) // qty 2 => 60
    await user.click(screen.getByTestId('nav-cart'))
    expect(screen.getByTestId('line-subtotal-s2')).toHaveTextContent('60')
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('60')
    expect(screen.getByTestId('cart-tax')).toHaveTextContent('6')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('66')
  })

  it('updates qty via the qty input', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-s1')) // 12
    await user.click(screen.getByTestId('nav-cart'))
    const input = screen.getByTestId('qty-input-s1')
    fireEvent.change(input, { target: { value: '3' } })
    expect(screen.getByTestId('line-subtotal-s1')).toHaveTextContent('36')
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('36')
  })

  it('removes a line from the cart', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-s1'))
    await user.click(screen.getByTestId('nav-cart'))
    expect(screen.getByTestId('cart-line-s1')).toBeInTheDocument()
    await user.click(screen.getByTestId('remove-s1'))
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
  })

  it('setting qty to zero removes the line', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-s1'))
    await user.click(screen.getByTestId('nav-cart'))
    const input = screen.getByTestId('qty-input-s1')
    fireEvent.change(input, { target: { value: '0' } })
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
  })

  it('checks out, confirming the order and clearing the cart', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-s5')) // 25
    await user.click(screen.getByTestId('nav-cart'))
    await user.click(screen.getByTestId('go-checkout'))
    expect(screen.getByTestId('summary-count')).toHaveTextContent('1')
    expect(screen.getByTestId('summary-subtotal')).toHaveTextContent('25')
    await user.click(screen.getByTestId('place-order'))
    expect(screen.getByTestId('order-confirmed')).toBeInTheDocument()
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('0')
  })

  it('shows a checkout-empty message when there is nothing to buy', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('checkout-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('place-order')).not.toBeInTheDocument()
  })

  it('keeps a single cart line when adding the same product repeatedly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-s1'))
    await user.click(screen.getByTestId('add-s1'))
    await user.click(screen.getByTestId('add-s1'))
    await user.click(screen.getByTestId('nav-cart'))
    const lines = screen.getByTestId('cart-lines')
    expect(within(lines).getAllByText('Aero Mug')).toHaveLength(1)
    expect(screen.getByTestId('line-subtotal-s1')).toHaveTextContent('36')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('cart', () => {
  it('lists the seeded products to add', () => {
    render(<App />)
    expect(screen.getByTestId('product-c1')).toBeInTheDocument()
    expect(screen.getByTestId('price-c2')).toHaveTextContent('30')
  })

  it('adds a product to the cart and bumps the badge', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c1'))
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-line-c1')).toBeInTheDocument()
  })

  it('computes line subtotal and cart subtotal', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c2')) // 30
    await user.click(screen.getByTestId('add-c3')) // 6
    expect(screen.getByTestId('line-subtotal-c2')).toHaveTextContent('30')
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('36')
  })

  it('updates qty via the qty input', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c1')) // 12
    fireEvent.change(screen.getByTestId('qty-input-c1'), { target: { value: '3' } })
    expect(screen.getByTestId('line-subtotal-c1')).toHaveTextContent('36')
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('36')
  })

  it('removes a line via the remove button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c1'))
    await user.click(screen.getByTestId('remove-c1'))
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
  })

  it('setting qty to zero removes the line', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c1'))
    fireEvent.change(screen.getByTestId('qty-input-c1'), { target: { value: '0' } })
    expect(screen.getByTestId('cart-empty')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

async function applyCode(user: ReturnType<typeof userEvent.setup>, code: string) {
  await user.click(screen.getByTestId('nav-coupons'))
  await user.type(screen.getByTestId('code-input'), code)
  await user.click(screen.getByTestId('apply-code'))
}

describe('checkout totals', () => {
  it('shows an empty checkout when the cart is empty', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('checkout-empty')).toBeInTheDocument()
    expect(screen.queryByTestId('place-order')).not.toBeInTheDocument()
  })

  it('shows subtotal with no discount when no coupon is applied', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c2')) // 30
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('summary-subtotal')).toHaveTextContent('30')
    expect(screen.getByTestId('summary-discount')).toHaveTextContent('0')
    expect(screen.getByTestId('summary-total')).toHaveTextContent('30')
    expect(screen.queryByTestId('summary-code')).not.toBeInTheDocument()
  })

  it('applies a percent discount to the total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c2')) // 30
    await applyCode(user, 'SAVE10') // 10% => 3 off
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('summary-discount')).toHaveTextContent('3')
    expect(screen.getByTestId('summary-total')).toHaveTextContent('27')
    expect(screen.getByTestId('summary-code')).toHaveTextContent('SAVE10')
  })

  it('applies a fixed discount to the total', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c2')) // 30
    await applyCode(user, 'FLAT5') // 5 off
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('summary-discount')).toHaveTextContent('5')
    expect(screen.getByTestId('summary-total')).toHaveTextContent('25')
  })

  it('ignores a min-spend coupon that is not yet valid', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c1')) // 12 (< 50)
    await applyCode(user, 'BIG20')
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('summary-discount')).toHaveTextContent('0')
    expect(screen.getByTestId('summary-total')).toHaveTextContent('12')
    expect(screen.queryByTestId('summary-code')).not.toBeInTheDocument()
  })

  it('places an order and confirms with the final total and code', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('add-c2')) // 30
    await applyCode(user, 'SAVE10')
    await user.click(screen.getByTestId('nav-checkout'))
    await user.click(screen.getByTestId('place-order'))
    expect(screen.getByTestId('page-confirmation')).toBeInTheDocument()
    expect(screen.getByTestId('confirmation-message')).toHaveTextContent('Thank you')
    expect(screen.getByTestId('confirm-total')).toHaveTextContent('27')
    expect(screen.getByTestId('confirm-code')).toHaveTextContent('SAVE10')
  })
})

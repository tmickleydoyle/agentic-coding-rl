import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

type U = ReturnType<typeof userEvent.setup>

async function fillShipping(u: U, zip = '94105') {
  await u.type(screen.getByLabelText(/full name/i), 'Ada Lovelace')
  await u.type(screen.getByLabelText(/address/i), '1 Analytical Way')
  await u.type(screen.getByLabelText(/city/i), 'London')
  await u.type(screen.getByLabelText(/zip code/i), zip)
}
async function fillPayment(u: U) {
  await u.type(screen.getByLabelText(/card number/i), '4242424242424242')
  await u.type(screen.getByLabelText(/name on card/i), 'Ada Lovelace')
  await u.type(screen.getByLabelText(/expiry/i), '12/29')
  await u.type(screen.getByLabelText(/cvc/i), '123')
}
const cont = () => screen.getByRole('button', { name: /continue/i })

describe('Checkout wizard', () => {
  it('starts on the Cart step with the seeded subtotal', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Cart' })).toBeInTheDocument()
    expect(screen.getByText(/subtotal: \$27\.00/i)).toBeInTheDocument()
  })

  it('increases a quantity and updates the subtotal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /increase notebook/i }))
    expect(screen.getByText(/subtotal: \$39\.00/i)).toBeInTheDocument()
  })

  it('does not decrease a quantity below 1', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /decrease pen/i }))
    await u.click(screen.getByRole('button', { name: /decrease pen/i }))
    // Pen stays at qty 1 ($3), so subtotal stays 24 + 3 = 27
    expect(screen.getByText(/subtotal: \$27\.00/i)).toBeInTheDocument()
  })

  it('removes an item and updates the subtotal', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove pen/i }))
    expect(screen.getByText(/subtotal: \$24\.00/i)).toBeInTheDocument()
  })

  it('disables Continue when the cart is emptied', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /remove notebook/i }))
    await u.click(screen.getByRole('button', { name: /remove pen/i }))
    expect(cont()).toBeDisabled()
  })

  it('gates the Shipping step until all fields are valid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(cont())
    expect(screen.getByRole('heading', { name: 'Shipping' })).toBeInTheDocument()
    expect(cont()).toBeDisabled()
    await fillShipping(u, '123') // too-short ZIP
    expect(cont()).toBeDisabled()
    await u.clear(screen.getByLabelText(/zip code/i))
    await u.type(screen.getByLabelText(/zip code/i), '94105')
    expect(cont()).toBeEnabled()
  })

  it('preserves shipping data when navigating Back', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(cont())
    await fillShipping(u)
    await u.click(cont()) // to Payment
    await u.click(screen.getByRole('button', { name: /back/i })) // back to Shipping
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Ada Lovelace')
    expect(screen.getByLabelText(/zip code/i)).toHaveValue('94105')
  })

  it('gates the Payment step until card details are valid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(cont())
    await fillShipping(u)
    await u.click(cont())
    expect(screen.getByRole('heading', { name: 'Payment' })).toBeInTheDocument()
    expect(cont()).toBeDisabled()
    await fillPayment(u)
    expect(cont()).toBeEnabled()
  })

  it('shows correct totals on Review (under $50: $5.99 shipping, 8% tax)', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(cont())
    await fillShipping(u)
    await u.click(cont())
    await fillPayment(u)
    await u.click(cont())
    expect(screen.getByRole('heading', { name: 'Review' })).toBeInTheDocument()
    expect(screen.getByText(/subtotal: \$27\.00/i)).toBeInTheDocument()
    expect(screen.getByText(/shipping: \$5\.99/i)).toBeInTheDocument()
    expect(screen.getByText(/tax: \$2\.16/i)).toBeInTheDocument()
    expect(screen.getByText(/total: \$35\.15/i)).toBeInTheDocument()
  })

  it('gives free shipping when the subtotal reaches $50', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: /increase notebook/i }))
    await u.click(screen.getByRole('button', { name: /increase notebook/i }))
    // Notebook now qty 4 ($48) + Pen ($3) = $51 subtotal
    await u.click(cont())
    await fillShipping(u)
    await u.click(cont())
    await fillPayment(u)
    await u.click(cont())
    expect(screen.getByText(/subtotal: \$51\.00/i)).toBeInTheDocument()
    expect(screen.getByText(/shipping: free/i)).toBeInTheDocument()
    expect(screen.getByText(/tax: \$4\.08/i)).toBeInTheDocument()
    expect(screen.getByText(/total: \$55\.08/i)).toBeInTheDocument()
  })

  it('completes the order and confirms with the total paid', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(cont())
    await fillShipping(u)
    await u.click(cont())
    await fillPayment(u)
    await u.click(cont())
    await u.click(screen.getByRole('button', { name: /place order/i }))
    expect(screen.getByRole('heading', { name: /order confirmed/i })).toBeInTheDocument()
    expect(screen.getByText(/total paid: \$35\.15/i)).toBeInTheDocument()
  })
})

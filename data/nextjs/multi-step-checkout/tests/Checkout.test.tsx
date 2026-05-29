import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkout from '../components/Checkout'

describe('Checkout', () => {
  it('starts on Cart with total $0 and Continue disabled', () => {
    render(<Checkout />)
    expect(screen.getByTestId('page-title')).toHaveTextContent('Cart')
    expect(screen.getByTestId('total')).toHaveTextContent('$0')
    expect(screen.getByTestId('next')).toBeDisabled()
  })

  it('Add raises total and enables Continue', async () => {
    const user = userEvent.setup()
    render(<Checkout />)
    await user.click(screen.getByTestId('add'))
    expect(screen.getByTestId('total')).toHaveTextContent('$5')
    expect(screen.getByTestId('next')).not.toBeDisabled()
    await user.click(screen.getByTestId('add'))
    expect(screen.getByTestId('total')).toHaveTextContent('$10')
  })

  it('advances to Shipping; Continue disabled until address typed', async () => {
    const user = userEvent.setup()
    render(<Checkout />)
    await user.click(screen.getByTestId('add'))
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('page-title')).toHaveTextContent('Shipping')
    expect(screen.getByTestId('next')).toBeDisabled()
    await user.type(screen.getByTestId('address'), '123 Main St')
    expect(screen.getByTestId('next')).not.toBeDisabled()
  })

  it('Back from Shipping preserves total', async () => {
    const user = userEvent.setup()
    render(<Checkout />)
    await user.click(screen.getByTestId('add'))
    await user.click(screen.getByTestId('add'))
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('back'))
    expect(screen.getByTestId('page-title')).toHaveTextContent('Cart')
    expect(screen.getByTestId('total')).toHaveTextContent('$10')
  })

  it('Confirmation shows summary; Back preserves address', async () => {
    const user = userEvent.setup()
    render(<Checkout />)
    await user.click(screen.getByTestId('add'))
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('address'), '123 Main St')
    await user.click(screen.getByTestId('next'))
    expect(screen.getByTestId('page-title')).toHaveTextContent('Confirmation')
    expect(screen.getByTestId('summary')).toHaveTextContent('123 Main St · $5')
    await user.click(screen.getByTestId('back'))
    expect((screen.getByTestId('address') as HTMLInputElement).value).toBe('123 Main St')
  })

  it('Place order shows the done view and nothing else', async () => {
    const user = userEvent.setup()
    render(<Checkout />)
    await user.click(screen.getByTestId('add'))
    await user.click(screen.getByTestId('next'))
    await user.type(screen.getByTestId('address'), '123 Main St')
    await user.click(screen.getByTestId('next'))
    await user.click(screen.getByTestId('submit'))
    expect(screen.getByTestId('done')).toHaveTextContent('Order placed')
    expect(screen.queryByTestId('summary')).toBeNull()
    expect(screen.queryByTestId('page-title')).toBeNull()
  })
})

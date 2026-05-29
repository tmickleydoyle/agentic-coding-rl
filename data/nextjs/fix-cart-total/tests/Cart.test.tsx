import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cart from '../components/Cart'

describe('Cart', () => {
  it('computes the initial total from price * qty', () => {
    render(<Cart />)
    // 2.5*2 + 4.0*1 + 1.25*0 = 9.00
    expect(screen.getByTestId('total')).toHaveTextContent('$9.00')
  })

  it('updates total when incrementing a quantity', async () => {
    const user = userEvent.setup()
    render(<Cart />)
    await user.click(screen.getByTestId('inc-3')) // Doohickey 1.25 * 1
    expect(screen.getByTestId('total')).toHaveTextContent('$10.25')
  })

  it('updates total when decrementing a quantity', async () => {
    const user = userEvent.setup()
    render(<Cart />)
    await user.click(screen.getByTestId('dec-1')) // Widget 2.5 * 1 now
    expect(screen.getByTestId('total')).toHaveTextContent('$6.50')
  })

  it('formats total to two decimals', () => {
    render(<Cart />)
    expect(screen.getByTestId('total').textContent).toMatch(/^\$\d+\.\d{2}$/)
  })

  it('quantity does not go below zero and total stays correct', async () => {
    const user = userEvent.setup()
    render(<Cart />)
    await user.click(screen.getByTestId('dec-3'))
    await user.click(screen.getByTestId('dec-3'))
    expect(screen.getByTestId('qty-3')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('$9.00')
  })
})

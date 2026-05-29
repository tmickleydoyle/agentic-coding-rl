import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cart from '../components/Cart'

const ITEMS = [
  { id: 1, name: 'Apple', price: 2 },
  { id: 2, name: 'Bread', price: 5 },
  { id: 3, name: 'Cheese', price: 10 },
]

describe('Shopping cart', () => {
  it('starts empty with total 0', () => {
    render(<Cart items={ITEMS} />)
    expect(within(screen.getByTestId('cart-lines')).queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByTestId('cart-total')).toHaveTextContent('0')
  })

  it('adding an item creates a line and updates total', async () => {
    const user = userEvent.setup()
    render(<Cart items={ITEMS} />)
    await user.click(screen.getByTestId('add-1'))
    expect(screen.getByTestId('line-1')).toHaveTextContent('Apple')
    expect(screen.getByTestId('line-1')).toHaveTextContent('x1')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('2')
  })

  it('adding the same item again increments qty, not lines', async () => {
    const user = userEvent.setup()
    render(<Cart items={ITEMS} />)
    await user.click(screen.getByTestId('add-1'))
    await user.click(screen.getByTestId('add-1'))
    await user.click(screen.getByTestId('add-1'))
    expect(within(screen.getByTestId('cart-lines')).getAllByRole('listitem')).toHaveLength(1)
    expect(screen.getByTestId('line-1')).toHaveTextContent('x3')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('6')
  })

  it('different items create separate lines and total adds up', async () => {
    const user = userEvent.setup()
    render(<Cart items={ITEMS} />)
    await user.click(screen.getByTestId('add-1'))
    await user.click(screen.getByTestId('add-2'))
    await user.click(screen.getByTestId('add-3'))
    expect(within(screen.getByTestId('cart-lines')).getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByTestId('cart-total')).toHaveTextContent('17')
  })

  it('removing a line drops it from the cart', async () => {
    const user = userEvent.setup()
    render(<Cart items={ITEMS} />)
    await user.click(screen.getByTestId('add-1'))
    await user.click(screen.getByTestId('add-2'))
    await user.click(screen.getByTestId('remove-1'))
    expect(screen.queryByTestId('line-1')).toBeNull()
    expect(screen.getByTestId('line-2')).toBeInTheDocument()
    expect(screen.getByTestId('cart-total')).toHaveTextContent('5')
  })
})

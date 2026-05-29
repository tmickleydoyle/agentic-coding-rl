import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Cart from '../components/Cart'

const PRODUCTS = [
  { id: 'a', name: 'Apple',  price: 2 },
  { id: 'b', name: 'Bread',  price: 5 },
  { id: 'c', name: 'Cheese', price: 7 },
]

describe('Cart', () => {
  it('starts empty with $0 total', () => {
    render(<Cart products={PRODUCTS} />)
    expect(within(screen.getByTestId('cart')).queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByTestId('total')).toHaveTextContent('$0')
  })

  it('adds an item and updates total', async () => {
    const user = userEvent.setup()
    render(<Cart products={PRODUCTS} />)
    await user.click(screen.getByTestId('add-a'))
    const lines = within(screen.getByTestId('cart')).getAllByRole('listitem')
    expect(lines).toHaveLength(1)
    expect(lines[0]).toHaveTextContent('Apple ×1')
    expect(screen.getByTestId('total')).toHaveTextContent('$2')
  })

  it('increments quantity instead of duplicating lines', async () => {
    const user = userEvent.setup()
    render(<Cart products={PRODUCTS} />)
    await user.click(screen.getByTestId('add-b'))
    await user.click(screen.getByTestId('add-b'))
    await user.click(screen.getByTestId('add-b'))
    const lines = within(screen.getByTestId('cart')).getAllByRole('listitem')
    expect(lines).toHaveLength(1)
    expect(lines[0]).toHaveTextContent('Bread ×3')
    expect(screen.getByTestId('total')).toHaveTextContent('$15')
  })

  it('removes a unit and decrements total', async () => {
    const user = userEvent.setup()
    render(<Cart products={PRODUCTS} />)
    await user.click(screen.getByTestId('add-c'))
    await user.click(screen.getByTestId('add-c'))
    await user.click(screen.getByTestId('remove-c'))
    const lines = within(screen.getByTestId('cart')).getAllByRole('listitem')
    expect(lines).toHaveLength(1)
    expect(lines[0]).toHaveTextContent('Cheese ×1')
    expect(screen.getByTestId('total')).toHaveTextContent('$7')
  })

  it('removes the line entirely when quantity hits 0', async () => {
    const user = userEvent.setup()
    render(<Cart products={PRODUCTS} />)
    await user.click(screen.getByTestId('add-a'))
    await user.click(screen.getByTestId('remove-a'))
    expect(within(screen.getByTestId('cart')).queryAllByRole('listitem')).toHaveLength(0)
    expect(screen.getByTestId('total')).toHaveTextContent('$0')
  })
})

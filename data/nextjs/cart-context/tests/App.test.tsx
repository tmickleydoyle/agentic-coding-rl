import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../components/App'
import { useCart } from '../components/CartContext'

const PRODUCTS = [
  { id: 'a', name: 'Apple', price: 2 },
  { id: 'b', name: 'Bread', price: 5 },
]

describe('Cart context', () => {
  it('starts empty', () => {
    render(<App products={PRODUCTS} />)
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('0')
    expect(screen.queryByTestId('line-a')).toBeNull()
  })

  it('adding a product creates a line with qty 1 and updates count/total', async () => {
    const user = userEvent.setup()
    render(<App products={PRODUCTS} />)
    await user.click(screen.getByTestId('add-a'))
    expect(screen.getByTestId('qty-a')).toHaveTextContent('1')
    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('total')).toHaveTextContent('2')
  })

  it('adding the same product again increments qty (no duplicate line)', async () => {
    const user = userEvent.setup()
    render(<App products={PRODUCTS} />)
    await user.click(screen.getByTestId('add-a'))
    await user.click(screen.getByTestId('add-a'))
    expect(screen.getAllByTestId('line-a')).toHaveLength(1)
    expect(screen.getByTestId('qty-a')).toHaveTextContent('2')
    expect(screen.getByTestId('count')).toHaveTextContent('2')
    expect(screen.getByTestId('total')).toHaveTextContent('4')
  })

  it('total mixes prices across products', async () => {
    const user = userEvent.setup()
    render(<App products={PRODUCTS} />)
    await user.click(screen.getByTestId('add-a')) // 2
    await user.click(screen.getByTestId('add-b')) // +5
    await user.click(screen.getByTestId('add-b')) // +5
    expect(screen.getByTestId('count')).toHaveTextContent('3')
    expect(screen.getByTestId('total')).toHaveTextContent('12')
  })

  it('remove decrements qty and drops the line at zero', async () => {
    const user = userEvent.setup()
    render(<App products={PRODUCTS} />)
    await user.click(screen.getByTestId('add-a'))
    await user.click(screen.getByTestId('add-a'))
    await user.click(screen.getByTestId('remove-a'))
    expect(screen.getByTestId('qty-a')).toHaveTextContent('1')
    await user.click(screen.getByTestId('remove-a'))
    expect(screen.queryByTestId('line-a')).toBeNull()
    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('0')
  })

  it('lines keep first-added order', async () => {
    const user = userEvent.setup()
    render(<App products={PRODUCTS} />)
    await user.click(screen.getByTestId('add-b'))
    await user.click(screen.getByTestId('add-a'))
    const ids = screen.getAllByTestId(/^line-/).map((el) => el.getAttribute('data-testid'))
    expect(ids).toEqual(['line-b', 'line-a'])
  })

  it('useCart outside a provider throws', () => {
    function Orphan() {
      useCart()
      return null
    }
    expect(() => render(<Orphan />)).toThrow()
  })
})

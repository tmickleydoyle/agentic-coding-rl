import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import ProductList from '../components/ProductList'

const PRODUCTS = [
  { id: 'a', name: 'Apple',  price: 2, inStock: true  },
  { id: 'b', name: 'Bread',  price: 5, inStock: false },
  { id: 'c', name: 'Cheese', price: 7, inStock: true  },
]

describe('ProductList', () => {
  it('renders a ProductCard per product', () => {
    render(<ProductList products={PRODUCTS} />)
    expect(screen.getByTestId('list')).toBeInTheDocument()
    expect(screen.getByTestId('card-a')).toBeInTheDocument()
    expect(screen.getByTestId('card-b')).toBeInTheDocument()
    expect(screen.getByTestId('card-c')).toBeInTheDocument()
  })

  it('cards show name, price, and stock status', () => {
    render(<ProductList products={PRODUCTS} />)
    expect(screen.getByTestId('name-a')).toHaveTextContent('Apple')
    expect(screen.getByTestId('price-a')).toHaveTextContent('$2')
    expect(screen.getByTestId('stock-a')).toHaveTextContent('In stock')
    expect(screen.getByTestId('stock-b')).toHaveTextContent('Out of stock')
  })

  it('out-of-stock cards are aria-disabled', () => {
    render(<ProductList products={PRODUCTS} />)
    expect(screen.getByTestId('card-b')).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByTestId('card-a')).not.toHaveAttribute('aria-disabled', 'true')
  })

  it('count reflects in-stock products only', () => {
    render(<ProductList products={PRODUCTS} />)
    expect(screen.getByTestId('count')).toHaveTextContent('2')
  })

  it('handles empty list (count = 0)', () => {
    render(<ProductList products={[]} />)
    expect(screen.getByTestId('list')).toBeInTheDocument()
    expect(screen.getByTestId('count')).toHaveTextContent('0')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('products page', () => {
  it('lists products with name, average and count from seed', () => {
    render(<App />)
    expect(screen.getByTestId('product-p1-name')).toHaveTextContent('Wireless Mouse')
    // p1 has reviews 5 and 3 => average 4.0
    expect(screen.getByTestId('product-p1-avg')).toHaveTextContent('4.0')
    expect(screen.getByTestId('product-p1-count')).toHaveTextContent('2')
  })

  it('shows average 0.0 and count 0 for a product with no reviews', () => {
    render(<App />)
    expect(screen.getByTestId('product-p3-avg')).toHaveTextContent('0.0')
    expect(screen.getByTestId('product-p3-count')).toHaveTextContent('0')
  })

  it('viewing a product navigates to its reviews page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-p1'))
    expect(screen.getByTestId('page-product-reviews')).toBeInTheDocument()
    expect(screen.getByTestId('selected-name')).toHaveTextContent('Wireless Mouse')
    expect(screen.getByTestId('selected-avg')).toHaveTextContent('4.0')
  })
})

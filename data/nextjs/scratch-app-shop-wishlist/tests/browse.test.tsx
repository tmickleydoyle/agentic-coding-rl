import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('browse', () => {
  it('lists the seeded products', () => {
    render(<App />)
    const grid = screen.getByTestId('product-grid')
    expect(within(grid).getByText('Aero Mug')).toBeInTheDocument()
    expect(within(grid).getByText('Yoga Mat')).toBeInTheDocument()
  })

  it('filters products by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'kitchen')
    expect(screen.getByTestId('product-w1')).toBeInTheDocument()
    expect(screen.getByTestId('product-w4')).toBeInTheDocument()
    expect(screen.queryByTestId('product-w2')).not.toBeInTheDocument()
  })

  it('filters products by max price', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByTestId('max-price'), '12')
    expect(screen.getByTestId('product-w1')).toBeInTheDocument() // 12
    expect(screen.getByTestId('product-w3')).toBeInTheDocument() // 6
    expect(screen.queryByTestId('product-w4')).not.toBeInTheDocument() // 45
  })

  it('shows an empty state when filters match nothing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'fitness')
    await user.type(screen.getByTestId('max-price'), '5')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('product-grid')).not.toBeInTheDocument()
  })

  it('reflects wishlisted state on the product card', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('product-w1')).toHaveAttribute('data-wished', 'false')
    await user.click(screen.getByTestId('wish-w1'))
    expect(screen.getByTestId('product-w1')).toHaveAttribute('data-wished', 'true')
  })
})

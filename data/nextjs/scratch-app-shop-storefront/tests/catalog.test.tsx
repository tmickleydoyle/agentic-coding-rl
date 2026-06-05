import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('catalog', () => {
  it('lists the seeded products', () => {
    render(<App />)
    const grid = screen.getByTestId('product-grid')
    expect(within(grid).getByText('Aero Mug')).toBeInTheDocument()
    expect(within(grid).getByText('Desk Lamp')).toBeInTheDocument()
    expect(within(grid).getByText('Yoga Mat')).toBeInTheDocument()
  })

  it('filters products by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'office')
    expect(screen.getByTestId('product-s2')).toBeInTheDocument() // Desk Lamp
    expect(screen.getByTestId('product-s3')).toBeInTheDocument() // Notebook
    expect(screen.queryByTestId('product-s1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('product-s5')).not.toBeInTheDocument()
  })

  it('filters products by max price', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.clear(screen.getByTestId('max-price'))
    await user.type(screen.getByTestId('max-price'), '12')
    expect(screen.getByTestId('product-s1')).toBeInTheDocument() // 12
    expect(screen.getByTestId('product-s3')).toBeInTheDocument() // 6
    expect(screen.queryByTestId('product-s2')).not.toBeInTheDocument() // 30
    expect(screen.queryByTestId('product-s4')).not.toBeInTheDocument() // 45
  })

  it('shows an empty state when filters match nothing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'fitness')
    await user.type(screen.getByTestId('max-price'), '5')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('product-grid')).not.toBeInTheDocument()
  })

  it('opens a product detail page from the catalog', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-s4'))
    expect(screen.getByTestId('page-product')).toBeInTheDocument()
    expect(screen.getByTestId('product-name')).toHaveTextContent('Chef Knife')
    expect(screen.getByTestId('product-price')).toHaveTextContent('45')
  })
})

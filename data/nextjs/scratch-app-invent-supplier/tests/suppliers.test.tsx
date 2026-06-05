import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('suppliers list', () => {
  it('lists all seeded suppliers with details', () => {
    render(<App />)
    const list = screen.getByTestId('supplier-list')
    expect(within(list).getByText('Acme Parts')).toBeInTheDocument()
    expect(screen.getByTestId('supplier-s1-lead')).toHaveTextContent('5')
    expect(screen.getByTestId('supplier-s1-rating')).toHaveTextContent('4.5')
    expect(screen.getByTestId('supplier-count')).toHaveTextContent('3')
  })

  it('shows average lead time of all suppliers', () => {
    render(<App />)
    // (5 + 12 + 7) / 3 = 8
    expect(screen.getByTestId('avg-lead-time')).toHaveTextContent('8')
  })

  it('filters by category and recomputes the average', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('category-filter'), 'Hardware')
    expect(screen.getByTestId('supplier-s1')).toBeInTheDocument()
    expect(screen.queryByTestId('supplier-s2')).not.toBeInTheDocument()
    expect(screen.getByTestId('supplier-count')).toHaveTextContent('1')
    expect(screen.getByTestId('avg-lead-time')).toHaveTextContent('5')
  })
})

describe('supplier detail', () => {
  it('opens a supplier and lists its products', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s1'))
    expect(screen.getByTestId('page-supplier-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Acme Parts')
    expect(screen.getByTestId('detail-product-count')).toHaveTextContent('2')
    expect(screen.getByTestId('detail-product-pr1')).toBeInTheDocument()
    expect(screen.getByTestId('detail-product-pr2')).toBeInTheDocument()
  })

  it('shows lead time and rating on the detail page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('open-s2'))
    expect(screen.getByTestId('detail-lead')).toHaveTextContent('12')
    expect(screen.getByTestId('detail-rating')).toHaveTextContent('3.8')
    expect(screen.getByTestId('detail-product-count')).toHaveTextContent('1')
  })

  it('shows no-selection when none picked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-supplier-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})

describe('products page', () => {
  it('lists products with their supplier name', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-products'))
    expect(screen.getByTestId('product-count')).toHaveTextContent('4')
    expect(screen.getByTestId('product-pr3-supplier')).toHaveTextContent('Global Foods')
  })

  it('jumps to a supplier from a product', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-products'))
    await user.click(screen.getByTestId('product-pr4-open-supplier'))
    expect(screen.getByTestId('page-supplier-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('TextilePro')
  })
})

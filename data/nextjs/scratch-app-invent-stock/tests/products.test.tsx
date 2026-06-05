import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('products list', () => {
  it('lists the seeded products with low flags', () => {
    render(<App />)
    const list = screen.getByTestId('product-list')
    expect(within(list).getByText('Widget')).toBeInTheDocument()
    expect(screen.getByTestId('product-p1')).toHaveAttribute('data-low', 'false')
    expect(screen.getByTestId('product-p2')).toHaveAttribute('data-low', 'true')
    expect(screen.getByTestId('product-p3')).toHaveAttribute('data-low', 'true')
  })

  it('shows a LOW alert only on low products', () => {
    render(<App />)
    expect(screen.queryByTestId('product-p1-alert')).not.toBeInTheDocument()
    expect(screen.getByTestId('product-p2-alert')).toHaveTextContent('LOW')
  })

  it('shows quantity and reorder point per product', () => {
    render(<App />)
    expect(screen.getByTestId('product-p1-qty')).toHaveTextContent('40')
    expect(screen.getByTestId('product-p1-reorder')).toHaveTextContent('10')
  })

  it('shows stat totals', () => {
    render(<App />)
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-low-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-units-value')).toHaveTextContent('45')
  })

  it('filters to low products', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('stock-filter'), 'low')
    expect(screen.getByTestId('product-p2')).toBeInTheDocument()
    expect(screen.queryByTestId('product-p1')).not.toBeInTheDocument()
  })

  it('filters to ok products', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('stock-filter'), 'ok')
    expect(screen.getByTestId('product-p1')).toBeInTheDocument()
    expect(screen.queryByTestId('product-p2')).not.toBeInTheDocument()
  })

  it('opens product detail from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-p1'))
    expect(screen.getByTestId('page-product-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-name')).toHaveTextContent('Widget')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('ok')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('orders list', () => {
  it('lists seeded orders with derived status', () => {
    render(<App />)
    const list = screen.getByTestId('order-list')
    expect(within(list).getByText('Bolts')).toBeInTheDocument()
    expect(screen.getByTestId('order-po1')).toHaveAttribute('data-status', 'received')
    expect(screen.getByTestId('order-po2')).toHaveAttribute('data-status', 'partial')
    expect(screen.getByTestId('order-po3')).toHaveAttribute('data-status', 'open')
  })

  it('shows progress and outstanding per order', () => {
    render(<App />)
    expect(screen.getByTestId('order-po2-progress')).toHaveTextContent('20/50')
    expect(screen.getByTestId('order-po2-outstanding')).toHaveTextContent('30')
  })

  it('shows the supplier per order', () => {
    render(<App />)
    expect(screen.getByTestId('order-po3-supplier')).toHaveTextContent('Globex')
  })

  it('filters orders by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('status-filter'), 'partial')
    expect(screen.getByTestId('order-po2')).toBeInTheDocument()
    expect(screen.queryByTestId('order-po1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('order-po3')).not.toBeInTheDocument()
  })

  it('shows an empty state when the filter matches nothing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('status-filter'), 'cancelled')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('order-list')).not.toBeInTheDocument()
  })

  it('opens an order detail from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-po2'))
    expect(screen.getByTestId('page-order-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-item')).toHaveTextContent('Nuts')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('partial')
  })
})

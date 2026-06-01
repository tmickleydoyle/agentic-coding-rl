import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('orders list', () => {
  it('lists the seeded orders with their status', () => {
    render(<App />)
    const list = screen.getByTestId('order-list')
    expect(within(list).getByText('Aero Mug')).toBeInTheDocument()
    expect(screen.getByTestId('order-o1')).toHaveAttribute('data-status', 'delivered')
    expect(screen.getByTestId('order-o2')).toHaveAttribute('data-status', 'shipped')
    expect(screen.getByTestId('order-o3')).toHaveAttribute('data-status', 'placed')
  })

  it('shows order totals', () => {
    render(<App />)
    expect(screen.getByTestId('order-o3-total')).toHaveTextContent('45')
  })

  it('filters orders by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByTestId('status-filter'), 'shipped')
    expect(screen.getByTestId('order-o2')).toBeInTheDocument()
    expect(screen.queryByTestId('order-o1')).not.toBeInTheDocument()
    expect(screen.queryByTestId('order-o3')).not.toBeInTheDocument()
  })

  it('shows an empty state when the filter matches nothing', async () => {
    const user = userEvent.setup()
    render(<App />)
    // advance the only placed order (o3) to shipped, then filter for placed => empty
    await user.click(screen.getByTestId('view-o3'))
    await user.click(screen.getByTestId('go-track'))
    await user.click(screen.getByTestId('advance')) // placed -> shipped
    await user.click(screen.getByTestId('nav-orders'))
    await user.selectOptions(screen.getByTestId('status-filter'), 'placed')
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('order-list')).not.toBeInTheDocument()
  })

  it('opens an order detail from the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-o2'))
    expect(screen.getByTestId('page-order-detail')).toBeInTheDocument()
    expect(screen.getByTestId('detail-item')).toHaveTextContent('Desk Lamp')
    expect(screen.getByTestId('detail-status')).toHaveTextContent('shipped')
  })
})

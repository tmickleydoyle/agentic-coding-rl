import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('reorder and account', () => {
  it('reorders an order, creating a new placed order with the same item', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-o1')) // Aero Mug, delivered
    await user.click(screen.getByTestId('reorder'))
    await user.click(screen.getByTestId('nav-orders'))
    const newRow = screen.getByTestId('order-o4')
    expect(newRow).toHaveAttribute('data-status', 'placed')
    expect(within(newRow).getByText('Aero Mug')).toBeInTheDocument()
    expect(screen.getByTestId('order-o4-total')).toHaveTextContent('12')
  })

  it('keeps the original order unchanged after reorder', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-o1'))
    await user.click(screen.getByTestId('reorder'))
    await user.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('order-o1')).toHaveAttribute('data-status', 'delivered')
  })

  it('summarizes order counts on the account page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-account'))
    expect(screen.getByTestId('order-summary')).toHaveTextContent(
      '3 orders: 1 delivered, 1 shipped, 1 placed',
    )
  })

  it('updates the account summary after a reorder', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('view-o1'))
    await user.click(screen.getByTestId('reorder'))
    await user.click(screen.getByTestId('nav-account'))
    expect(screen.getByTestId('order-summary')).toHaveTextContent(
      '4 orders: 1 delivered, 1 shipped, 2 placed',
    )
  })

  it('toggles the theme and persists it across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-account'))
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})

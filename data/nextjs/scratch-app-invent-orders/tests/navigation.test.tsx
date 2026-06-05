import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the orders page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-orders')).toBeInTheDocument()
    expect(screen.getByTestId('nav-orders')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-new')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the suppliers page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-suppliers'))
    expect(screen.getByTestId('page-suppliers')).toBeInTheDocument()
    expect(screen.getByTestId('nav-suppliers')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-orders')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the new order page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
  })

  it('shows a no-selection message on detail when nothing selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-order-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})

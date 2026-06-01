import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the orders page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-orders')).toBeInTheDocument()
    expect(screen.getByTestId('nav-orders')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-track')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the account page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-account'))
    expect(screen.getByTestId('page-account')).toBeInTheDocument()
    expect(screen.getByTestId('nav-account')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-orders')).not.toHaveAttribute('aria-current')
  })

  it('shows a no-selection message on the detail page when nothing is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-order-detail'))
    expect(screen.getByTestId('page-order-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('shows a no-selection message on the track page when nothing is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-track'))
    expect(screen.getByTestId('page-track')).toBeInTheDocument()
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the dashboard by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-dashboard')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-invoices')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the invoices page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-invoices'))
    expect(screen.getByTestId('page-invoices')).toBeInTheDocument()
    expect(screen.getByTestId('nav-invoices')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-dashboard')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the clients page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-clients'))
    expect(screen.getByTestId('page-clients')).toBeInTheDocument()
    expect(screen.getByTestId('nav-clients')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to new-invoice and back to dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new-invoice'))
    expect(screen.getByTestId('page-new-invoice')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-new-invoice')).not.toHaveAttribute('aria-current')
  })
})

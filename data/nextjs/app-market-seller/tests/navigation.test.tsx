import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders products by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-products')).toBeInTheDocument()
    expect(screen.getByTestId('nav-products')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-orders')).not.toHaveAttribute('aria-current')
  })

  it('navigates to orders', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-orders'))
    expect(screen.getByTestId('page-orders')).toBeInTheDocument()
    expect(screen.getByTestId('nav-orders')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to revenue and back to products', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-revenue'))
    expect(screen.getByTestId('page-revenue')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-products'))
    expect(screen.getByTestId('page-products')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

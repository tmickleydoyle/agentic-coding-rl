import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the products page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-products')).toBeInTheDocument()
    expect(screen.getByTestId('nav-products')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-adjust')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the low-stock page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-low-stock'))
    expect(screen.getByTestId('page-low-stock')).toBeInTheDocument()
    expect(screen.getByTestId('nav-low-stock')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-products')).not.toHaveAttribute('aria-current')
  })

  it('shows a no-selection message on detail when nothing selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-product-detail'))
    expect(screen.getByTestId('page-product-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('shows a no-selection message on adjust when nothing selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-adjust'))
    expect(screen.getByTestId('page-adjust')).toBeInTheDocument()
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})

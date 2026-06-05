import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the products page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-products')).toBeInTheDocument()
    expect(screen.getByTestId('nav-products')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-top-rated')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the write-review page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-write-review'))
    expect(screen.getByTestId('page-write-review')).toBeInTheDocument()
    expect(screen.getByTestId('nav-write-review')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the top-rated page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-top-rated'))
    expect(screen.getByTestId('page-top-rated')).toBeInTheDocument()
  })

  it('shows a no-selection message on the reviews page before a product is chosen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-product-reviews'))
    expect(screen.getByTestId('page-product-reviews')).toBeInTheDocument()
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('toggles theme and reflects it on the root, persisting across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-top-rated'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})

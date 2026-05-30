import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the overview page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-overview')).toBeInTheDocument()
    expect(screen.getByTestId('nav-overview')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-products')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the products route', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-products'))
    expect(screen.getByTestId('page-products')).toBeInTheDocument()
    expect(screen.getByTestId('nav-products')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-overview')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the regions route', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-regions'))
    expect(screen.getByTestId('page-regions')).toBeInTheDocument()
    expect(screen.getByTestId('nav-regions')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to trends and back to overview', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-trends'))
    expect(screen.getByTestId('page-trends')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-overview'))
    expect(screen.getByTestId('page-overview')).toBeInTheDocument()
    expect(screen.getByTestId('nav-trends')).not.toHaveAttribute('aria-current')
  })
})

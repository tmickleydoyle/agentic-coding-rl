import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the listings page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-listings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-listings')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-favorites')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the favorites page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('page-favorites')).toBeInTheDocument()
    expect(screen.getByTestId('nav-favorites')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-listings')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the filters page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-filters'))
    expect(screen.getByTestId('page-filters')).toBeInTheDocument()
    expect(screen.getByTestId('nav-filters')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to filters and back to listings', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-filters'))
    expect(screen.getByTestId('page-filters')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-listings'))
    expect(screen.getByTestId('page-listings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-filters')).not.toHaveAttribute('aria-current')
  })
})

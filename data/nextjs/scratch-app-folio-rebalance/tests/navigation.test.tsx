import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the portfolio page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-portfolio')).toBeInTheDocument()
    expect(screen.getByTestId('nav-portfolio')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-targets')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the targets page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-targets'))
    expect(screen.getByTestId('page-targets')).toBeInTheDocument()
    expect(screen.getByTestId('nav-targets')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the rebalance page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-rebalance'))
    expect(screen.getByTestId('page-rebalance')).toBeInTheDocument()
  })

  it('navigates to history and back to portfolio', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-portfolio'))
    expect(screen.getByTestId('page-portfolio')).toBeInTheDocument()
    expect(screen.getByTestId('nav-history')).not.toHaveAttribute('aria-current')
  })

  it('persists the theme across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})

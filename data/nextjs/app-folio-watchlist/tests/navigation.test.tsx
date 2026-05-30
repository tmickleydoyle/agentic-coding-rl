import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the watchlist page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-watchlist')).toBeInTheDocument()
    expect(screen.getByTestId('nav-watchlist')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-add')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the ticker-detail page (no ticker selected)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-ticker-detail'))
    expect(screen.getByTestId('page-ticker-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-ticker-selected')).toBeInTheDocument()
  })

  it('navigates to alerts and back to watchlist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-alerts'))
    expect(screen.getByTestId('page-alerts')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-watchlist'))
    expect(screen.getByTestId('page-watchlist')).toBeInTheDocument()
    expect(screen.getByTestId('nav-alerts')).not.toHaveAttribute('aria-current')
  })

  it('persists the theme across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-alerts'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})

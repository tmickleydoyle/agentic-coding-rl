import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders browse by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-browse')).toBeInTheDocument()
    expect(screen.getByTestId('nav-browse')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-watchlist')).not.toHaveAttribute('aria-current')
  })

  it('navigates to watchlist and history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-watchlist'))
    expect(screen.getByTestId('page-watchlist')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
    expect(screen.getByTestId('nav-watchlist')).not.toHaveAttribute('aria-current')
  })

  it('shows no-video on the detail page before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-video-detail'))
    expect(screen.getByTestId('no-video')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders auctions by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-auctions')).toBeInTheDocument()
    expect(screen.getByTestId('nav-auctions')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-won')).not.toHaveAttribute('aria-current')
  })

  it('navigates to my bids', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-mybids'))
    expect(screen.getByTestId('page-mybids')).toBeInTheDocument()
    expect(screen.getByTestId('nav-mybids')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to won and back to auctions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-won'))
    expect(screen.getByTestId('page-won')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-auctions'))
    expect(screen.getByTestId('page-auctions')).toBeInTheDocument()
  })

  it('shows no-selection on detail when nothing selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

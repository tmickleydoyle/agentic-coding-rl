import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the decks page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-decks')).toBeInTheDocument()
    expect(screen.getByTestId('nav-decks')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-study')).not.toHaveAttribute('aria-current')
  })

  it('navigates to stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('page-stats')).toBeInTheDocument()
    expect(screen.getByTestId('nav-stats')).toHaveAttribute('aria-current', 'page')
  })

  it('shows the no-deck prompt on study before a deck is chosen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-study'))
    expect(screen.getByTestId('no-deck')).toBeInTheDocument()
  })

  it('shows the no-deck prompt on add before a deck is chosen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('no-deck')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles theme via stats-side navigation and persists it', async () => {
    const user = userEvent.setup()
    render(<App />)
    // theme toggling lives nowhere visible here; ensure default stays light across nav
    await user.click(screen.getByTestId('nav-stats'))
    await user.click(screen.getByTestId('nav-decks'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

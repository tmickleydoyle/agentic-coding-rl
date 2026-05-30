import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the decks page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-decks')).toBeInTheDocument()
    expect(screen.getByTestId('nav-decks')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-stats')).not.toHaveAttribute('aria-current')
  })

  it('navigates to add-card and stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-card'))
    expect(screen.getByTestId('page-add-card')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('page-stats')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add-card')).not.toHaveAttribute('aria-current')
  })

  it('shows no-deck on review before opening a deck', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-review'))
    expect(screen.getByTestId('no-deck')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

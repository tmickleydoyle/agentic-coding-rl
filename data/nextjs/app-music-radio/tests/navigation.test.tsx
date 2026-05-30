import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the stations page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-stations')).toBeInTheDocument()
    expect(screen.getByTestId('nav-stations')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-history')).not.toHaveAttribute('aria-current')
  })

  it('navigates to favorites', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('page-favorites')).toBeInTheDocument()
    expect(screen.getByTestId('nav-favorites')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
  })

  it('shows no-station on detail before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-station-detail'))
    expect(screen.getByTestId('no-station')).toBeInTheDocument()
  })

  it('defaults to light theme and nothing playing', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByTestId('now-playing')).toHaveTextContent('Nothing playing')
  })
})

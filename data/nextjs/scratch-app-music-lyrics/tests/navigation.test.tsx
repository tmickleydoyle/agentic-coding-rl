import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the songs page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-songs')).toBeInTheDocument()
    expect(screen.getByTestId('nav-songs')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-search')).not.toHaveAttribute('aria-current')
  })

  it('navigates to search', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('page-search')).toBeInTheDocument()
    expect(screen.getByTestId('nav-search')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to favorites', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('page-favorites')).toBeInTheDocument()
  })

  it('shows no-song on detail before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-song-detail'))
    expect(screen.getByTestId('no-song')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

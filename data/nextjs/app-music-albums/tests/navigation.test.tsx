import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the albums page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-albums')).toBeInTheDocument()
    expect(screen.getByTestId('nav-albums')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-artists')).not.toHaveAttribute('aria-current')
  })

  it('navigates to artists', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-artists'))
    expect(screen.getByTestId('page-artists')).toBeInTheDocument()
    expect(screen.getByTestId('nav-artists')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to favorites', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('page-favorites')).toBeInTheDocument()
  })

  it('shows no-album on detail before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-album-detail'))
    expect(screen.getByTestId('no-album')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

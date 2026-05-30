import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the library page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-library')).toBeInTheDocument()
    expect(screen.getByTestId('nav-library')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-queue')).not.toHaveAttribute('aria-current')
  })

  it('navigates to queue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('page-queue')).toBeInTheDocument()
    expect(screen.getByTestId('nav-queue')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to search', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('page-search')).toBeInTheDocument()
  })

  it('shows no-playlist on playlist page before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-playlist'))
    expect(screen.getByTestId('no-playlist')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

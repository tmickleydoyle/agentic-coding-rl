import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders items by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-items')).toBeInTheDocument()
    expect(screen.getByTestId('nav-items')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-offers')).not.toHaveAttribute('aria-current')
  })

  it('navigates to offers', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-offers'))
    expect(screen.getByTestId('page-offers')).toBeInTheDocument()
    expect(screen.getByTestId('nav-offers')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to my trades and back to items', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-mytrades'))
    expect(screen.getByTestId('page-mytrades')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-items'))
    expect(screen.getByTestId('page-items')).toBeInTheDocument()
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

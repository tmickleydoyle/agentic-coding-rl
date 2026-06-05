import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the tickets page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-tickets')).toBeInTheDocument()
    expect(screen.getByTestId('nav-tickets')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-breaches')).not.toHaveAttribute('aria-current')
  })

  it('navigates to breaches', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-breaches'))
    expect(screen.getByTestId('page-breaches')).toBeInTheDocument()
    expect(screen.getByTestId('nav-breaches')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the dashboard and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-tickets'))
    expect(screen.getByTestId('page-tickets')).toBeInTheDocument()
  })

  it('exposes the theme on the app root and defaults to light', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

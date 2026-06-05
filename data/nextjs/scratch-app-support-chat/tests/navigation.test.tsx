import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the queue page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-queue')).toBeInTheDocument()
    expect(screen.getByTestId('nav-queue')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-history')).not.toHaveAttribute('aria-current')
  })

  it('navigates to history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
    expect(screen.getByTestId('nav-history')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to agents and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-agents'))
    expect(screen.getByTestId('page-agents')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('page-queue')).toBeInTheDocument()
  })

  it('exposes the theme on the app root and defaults to light', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

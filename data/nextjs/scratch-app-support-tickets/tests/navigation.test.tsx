import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the tickets page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-tickets')).toBeInTheDocument()
    expect(screen.getByTestId('nav-tickets')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-queue')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the new ticket page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
    expect(screen.getByTestId('nav-new')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the queue page and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('page-queue')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-tickets'))
    expect(screen.getByTestId('page-tickets')).toBeInTheDocument()
    expect(screen.getByTestId('nav-queue')).not.toHaveAttribute('aria-current')
  })

  it('exposes the theme on the app root and defaults to light', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

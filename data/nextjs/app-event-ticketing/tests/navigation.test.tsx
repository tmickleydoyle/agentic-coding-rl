import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders events by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-events')).toBeInTheDocument()
    expect(screen.getByTestId('nav-events')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-checkout')).not.toHaveAttribute('aria-current')
  })

  it('navigates to checkout', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-checkout'))
    expect(screen.getByTestId('page-checkout')).toBeInTheDocument()
    expect(screen.getByTestId('nav-checkout')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to my-tickets', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-tickets'))
    expect(screen.getByTestId('page-my-tickets')).toBeInTheDocument()
  })

  it('navigates to event-detail and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-event-detail'))
    expect(screen.getByTestId('page-event-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-events'))
    expect(screen.getByTestId('page-events')).toBeInTheDocument()
    expect(screen.getByTestId('nav-event-detail')).not.toHaveAttribute('aria-current')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

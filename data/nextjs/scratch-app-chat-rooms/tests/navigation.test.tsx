import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the rooms page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-rooms')).toBeInTheDocument()
    expect(screen.getByTestId('nav-rooms')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-members')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the members page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('page-members')).toBeInTheDocument()
    expect(screen.getByTestId('nav-members')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-rooms')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the settings page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to room then back to rooms', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-room'))
    expect(screen.getByTestId('page-room')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-rooms'))
    expect(screen.getByTestId('page-rooms')).toBeInTheDocument()
    expect(screen.getByTestId('nav-room')).not.toHaveAttribute('aria-current')
  })
})

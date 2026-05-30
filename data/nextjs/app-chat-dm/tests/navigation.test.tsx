import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the inbox page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-inbox')).toBeInTheDocument()
    expect(screen.getByTestId('nav-inbox')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-people')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the people page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-people'))
    expect(screen.getByTestId('page-people')).toBeInTheDocument()
    expect(screen.getByTestId('nav-people')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-inbox')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the settings page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to thread then back to inbox', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-thread'))
    expect(screen.getByTestId('page-thread')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-inbox'))
    expect(screen.getByTestId('page-inbox')).toBeInTheDocument()
    expect(screen.getByTestId('nav-thread')).not.toHaveAttribute('aria-current')
  })
})

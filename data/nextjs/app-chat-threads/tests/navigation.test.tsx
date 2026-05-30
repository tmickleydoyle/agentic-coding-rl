import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the channel page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-channel')).toBeInTheDocument()
    expect(screen.getByTestId('nav-channel')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-search')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the search page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('page-search')).toBeInTheDocument()
    expect(screen.getByTestId('nav-search')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-channel')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the settings page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to thread then back to channel', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-thread'))
    expect(screen.getByTestId('page-thread')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-channel'))
    expect(screen.getByTestId('page-channel')).toBeInTheDocument()
    expect(screen.getByTestId('nav-thread')).not.toHaveAttribute('aria-current')
  })
})

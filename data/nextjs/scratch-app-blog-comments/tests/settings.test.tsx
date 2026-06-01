import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('settings stats + theme', () => {
  it('shows status counts from seed data', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    // seed: 4 comments — 2 pending, 1 approved, 1 spam
    expect(screen.getByTestId('stat-total-value')).toHaveTextContent('4')
    expect(screen.getByTestId('stat-pending-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-approved-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-spam-value')).toHaveTextContent('1')
  })

  it('updates counts after approving a comment', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-moderation'))
    await user.click(screen.getByTestId('approve-k2'))
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('stat-approved-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-pending-value')).toHaveTextContent('1')
  })

  it('defaults to light theme reflected on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles the theme and persists it across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-posts'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})

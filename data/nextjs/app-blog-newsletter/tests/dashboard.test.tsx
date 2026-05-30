import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('dashboard stats + theme', () => {
  it('shows campaign and subscriber stats from seed data', () => {
    render(<App />)
    // seed: 2 campaigns (1 sent, 1 draft), 3 subscribers (2 active)
    expect(screen.getByTestId('stat-campaigns-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-sent-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-draft-value')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-subscribers-value')).toHaveTextContent('3')
    expect(screen.getByTestId('stat-active-value')).toHaveTextContent('2')
  })

  it('updates sent count after sending a campaign', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-campaigns'))
    await user.click(screen.getByTestId('send-m2'))
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-sent-value')).toHaveTextContent('2')
    expect(screen.getByTestId('stat-draft-value')).toHaveTextContent('0')
  })

  it('updates active subscriber count after unsubscribing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscribers'))
    await user.click(screen.getByTestId('toggle-s1'))
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('stat-active-value')).toHaveTextContent('1')
  })

  it('defaults to light theme and toggles, persisting across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-campaigns'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})

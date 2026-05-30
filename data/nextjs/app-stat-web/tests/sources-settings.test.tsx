import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('sources view', () => {
  it('lists sources with names and sessions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-sources'))
    expect(screen.getByTestId('source-s1-name')).toHaveTextContent('Google')
    expect(screen.getByTestId('source-s1-sessions')).toHaveTextContent('900')
  })

  it('computes conversion rate as an integer percentage', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-sources'))
    // Google 90/900 = 10
    expect(screen.getByTestId('source-s1-rate')).toHaveTextContent('10')
    // Direct 30/600 = 5
    expect(screen.getByTestId('source-s2-rate')).toHaveTextContent('5')
    // Referral 46/230 = 20
    expect(screen.getByTestId('source-s3-rate')).toHaveTextContent('20')
  })
})

describe('settings', () => {
  it('shows the current theme and toggles it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('toggle-theme'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  it('reflects the theme on the app root and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('toggle-theme'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-overview'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('changing the range in settings affects the overview totals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.selectOptions(screen.getByTestId('default-range'), '7d')
    await user.click(screen.getByTestId('nav-overview'))
    expect(screen.getByTestId('stat-total-views-value')).toHaveTextContent('520')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('settings', () => {
  it('defaults to light theme reflected on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('toggles the theme to dark', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('persists the theme when navigating away and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.click(screen.getByTestId('theme-toggle'))
    await user.click(screen.getByTestId('nav-accounts'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })

  it('changes the currency and reflects it on the accounts page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    await user.selectOptions(screen.getByTestId('currency-select'), 'GBP')
    await user.click(screen.getByTestId('nav-accounts'))
    expect(screen.getByTestId('currency-label')).toHaveTextContent('GBP')
  })
})

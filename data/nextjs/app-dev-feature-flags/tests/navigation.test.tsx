import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the flags page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-flags')).toBeInTheDocument()
    expect(screen.getByTestId('nav-flags')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-audit')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the environments page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-environments'))
    expect(screen.getByTestId('page-environments')).toBeInTheDocument()
    expect(screen.getByTestId('nav-environments')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the audit page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-audit'))
    expect(screen.getByTestId('page-audit')).toBeInTheDocument()
  })

  it('shows a no-selection message on detail before a flag is chosen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-flag-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('toggles theme and persists it across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-audit'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})

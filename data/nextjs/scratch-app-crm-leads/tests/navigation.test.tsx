import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the leads page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-leads')).toBeInTheDocument()
    expect(screen.getByTestId('nav-leads')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-qualify')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the qualify page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-qualify'))
    expect(screen.getByTestId('page-qualify')).toBeInTheDocument()
    expect(screen.getByTestId('nav-qualify')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the converted page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-converted'))
    expect(screen.getByTestId('page-converted')).toBeInTheDocument()
    expect(screen.getByTestId('nav-converted')).toHaveAttribute('aria-current', 'page')
  })

  it('shows a no-lead message on the detail page before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-lead-detail'))
    expect(screen.getByTestId('page-lead-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-lead')).toBeInTheDocument()
  })

  it('reflects the default theme on app-root and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-qualify'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

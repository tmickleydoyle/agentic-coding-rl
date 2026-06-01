import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the cohorts page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-cohorts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-cohorts')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-retention')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the retention route', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-retention'))
    expect(screen.getByTestId('page-retention')).toBeInTheDocument()
    expect(screen.getByTestId('nav-retention')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-cohorts')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the breakdown route', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-breakdown'))
    expect(screen.getByTestId('page-breakdown')).toBeInTheDocument()
    expect(screen.getByTestId('nav-breakdown')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to cohorts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-cohorts'))
    expect(screen.getByTestId('page-cohorts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

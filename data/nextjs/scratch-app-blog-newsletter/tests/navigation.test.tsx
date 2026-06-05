import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the dashboard by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-dashboard')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-campaigns')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the campaigns page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-campaigns'))
    expect(screen.getByTestId('page-campaigns')).toBeInTheDocument()
    expect(screen.getByTestId('nav-campaigns')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the subscribers page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscribers'))
    expect(screen.getByTestId('page-subscribers')).toBeInTheDocument()
  })

  it('navigates to compose and back to dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-compose'))
    expect(screen.getByTestId('page-compose')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-compose')).not.toHaveAttribute('aria-current')
  })
})

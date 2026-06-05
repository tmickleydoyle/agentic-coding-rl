import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the dashboard by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-dashboard')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-subscriptions')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the subscriptions page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscriptions'))
    expect(screen.getByTestId('page-subscriptions')).toBeInTheDocument()
    expect(screen.getByTestId('nav-subscriptions')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the add page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to upcoming and back to dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-upcoming'))
    expect(screen.getByTestId('page-upcoming')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-upcoming')).not.toHaveAttribute('aria-current')
  })
})

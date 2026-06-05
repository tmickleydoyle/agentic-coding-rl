import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the dashboard by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-dashboard')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-expenses')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the expenses page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-expenses'))
    expect(screen.getByTestId('page-expenses')).toBeInTheDocument()
    expect(screen.getByTestId('nav-expenses')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the people page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-people'))
    expect(screen.getByTestId('page-people')).toBeInTheDocument()
    expect(screen.getByTestId('nav-people')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to balances and back to dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-balances'))
    expect(screen.getByTestId('page-balances')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-balances')).not.toHaveAttribute('aria-current')
  })
})

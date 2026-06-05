import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the accounts page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-accounts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-accounts')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-transfer')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the transfer page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transfer'))
    expect(screen.getByTestId('page-transfer')).toBeInTheDocument()
    expect(screen.getByTestId('nav-transfer')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-accounts')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the account-detail page (empty when nothing selected)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-account-detail'))
    expect(screen.getByTestId('page-account-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('navigates to settings and back to accounts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-accounts'))
    expect(screen.getByTestId('page-accounts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

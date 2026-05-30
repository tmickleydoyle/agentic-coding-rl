import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the cards page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-cards')).toBeInTheDocument()
    expect(screen.getByTestId('nav-cards')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the transactions page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-transactions'))
    expect(screen.getByTestId('page-transactions')).toBeInTheDocument()
    expect(screen.getByTestId('nav-transactions')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to card-detail (empty when nothing selected)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-card-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('navigates to settings and back to cards', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-cards'))
    expect(screen.getByTestId('page-cards')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the pots page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-pots')).toBeInTheDocument()
    expect(screen.getByTestId('nav-pots')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-create')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the create page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
    expect(screen.getByTestId('nav-create')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to pot-detail (empty when nothing selected)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pot-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('navigates to settings and back to pots', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-pots'))
    expect(screen.getByTestId('page-pots')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

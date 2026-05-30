import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the board by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-board')).toBeInTheDocument()
    expect(screen.getByTestId('nav-board')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-archive')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add-card page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-card'))
    expect(screen.getByTestId('page-add-card')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add-card')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-board')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the archive page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-archive'))
    expect(screen.getByTestId('page-archive')).toBeInTheDocument()
    expect(screen.getByTestId('nav-archive')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to the board', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('page-board')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

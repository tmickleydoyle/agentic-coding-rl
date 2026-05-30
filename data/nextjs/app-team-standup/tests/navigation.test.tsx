import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the today page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-today')).toBeInTheDocument()
    expect(screen.getByTestId('nav-today')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-history')).not.toHaveAttribute('aria-current')
  })

  it('navigates to history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
    expect(screen.getByTestId('nav-history')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-today')).not.toHaveAttribute('aria-current')
  })

  it('navigates to team', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-team'))
    expect(screen.getByTestId('page-team')).toBeInTheDocument()
    expect(screen.getByTestId('nav-team')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to add-entry and back to today', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-entry'))
    expect(screen.getByTestId('page-add-entry')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-today'))
    expect(screen.getByTestId('page-today')).toBeInTheDocument()
  })
})

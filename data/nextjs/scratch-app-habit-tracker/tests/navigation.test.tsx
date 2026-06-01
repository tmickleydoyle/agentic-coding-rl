import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the today page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-today')).toBeInTheDocument()
    expect(screen.getByTestId('nav-today')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-habits')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the habits page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-habits'))
    expect(screen.getByTestId('page-habits')).toBeInTheDocument()
    expect(screen.getByTestId('nav-habits')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the add page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('navigates to the stats page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('page-stats')).toBeInTheDocument()
    expect(screen.getByTestId('nav-stats')).toHaveAttribute('aria-current', 'page')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders availability by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-availability')).toBeInTheDocument()
    expect(screen.getByTestId('nav-availability')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-reserve')).not.toHaveAttribute('aria-current')
  })

  it('navigates to reserve', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reserve'))
    expect(screen.getByTestId('page-reserve')).toBeInTheDocument()
    expect(screen.getByTestId('nav-reserve')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to reservations', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-reservations'))
    expect(screen.getByTestId('page-reservations')).toBeInTheDocument()
  })

  it('navigates to tables and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tables'))
    expect(screen.getByTestId('page-tables')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-availability'))
    expect(screen.getByTestId('page-availability')).toBeInTheDocument()
    expect(screen.getByTestId('nav-tables')).not.toHaveAttribute('aria-current')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

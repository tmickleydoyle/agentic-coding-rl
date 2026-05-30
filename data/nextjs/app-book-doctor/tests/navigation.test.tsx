import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders providers by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-providers')).toBeInTheDocument()
    expect(screen.getByTestId('nav-providers')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-book')).not.toHaveAttribute('aria-current')
  })

  it('navigates to appointments', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-appointments'))
    expect(screen.getByTestId('page-appointments')).toBeInTheDocument()
    expect(screen.getByTestId('nav-appointments')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
  })

  it('shows no-provider hint when visiting book directly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-book'))
    expect(screen.getByTestId('no-provider')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

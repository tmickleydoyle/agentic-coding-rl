import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the schedule page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-schedule')).toBeInTheDocument()
    expect(screen.getByTestId('nav-schedule')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-register')).not.toHaveAttribute('aria-current')
  })

  it('navigates to register and feedback', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-register'))
    expect(screen.getByTestId('page-register')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-feedback'))
    expect(screen.getByTestId('page-feedback')).toBeInTheDocument()
    expect(screen.getByTestId('nav-register')).not.toHaveAttribute('aria-current')
  })

  it('reflects light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('shows a no-house message on detail before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-house-detail'))
    expect(screen.getByTestId('no-house')).toBeInTheDocument()
  })

  it('shows a no-house message on register before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-register'))
    expect(screen.getByTestId('no-house')).toBeInTheDocument()
  })
})

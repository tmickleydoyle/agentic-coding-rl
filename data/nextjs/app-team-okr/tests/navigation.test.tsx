import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the objectives page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-objectives')).toBeInTheDocument()
    expect(screen.getByTestId('nav-objectives')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-dashboard')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-dashboard')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-objectives')).not.toHaveAttribute('aria-current')
  })

  it('navigates to add', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('shows no-objective on detail before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-objective-detail'))
    expect(screen.getByTestId('no-objective')).toBeInTheDocument()
  })
})

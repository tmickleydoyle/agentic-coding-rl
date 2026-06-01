import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the units page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-units')).toBeInTheDocument()
    expect(screen.getByTestId('nav-units')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-occupancy')).not.toHaveAttribute('aria-current')
  })

  it('navigates to applications and occupancy', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-applications'))
    expect(screen.getByTestId('page-applications')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-occupancy'))
    expect(screen.getByTestId('page-occupancy')).toBeInTheDocument()
    expect(screen.getByTestId('nav-applications')).not.toHaveAttribute('aria-current')
  })

  it('reflects light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('shows a no-unit message on detail before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-unit-detail'))
    expect(screen.getByTestId('no-unit')).toBeInTheDocument()
  })
})

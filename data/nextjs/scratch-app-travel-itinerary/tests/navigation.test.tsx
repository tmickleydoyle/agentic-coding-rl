import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the trips page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-trips')).toBeInTheDocument()
    expect(screen.getByTestId('nav-trips')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-budget')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add-activity page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-activity'))
    expect(screen.getByTestId('page-add-activity')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add-activity')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the budget page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-budget'))
    expect(screen.getByTestId('page-budget')).toBeInTheDocument()
  })

  it('shows the no-trip placeholder on trip-detail before a trip is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-trip-detail'))
    expect(screen.getByTestId('no-trip')).toBeInTheDocument()
  })
})

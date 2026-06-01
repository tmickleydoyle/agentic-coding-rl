import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the trips page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-trips')).toBeInTheDocument()
    expect(screen.getByTestId('nav-trips')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-summary')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add-item page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-item'))
    expect(screen.getByTestId('page-add-item')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add-item')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the summary page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-summary'))
    expect(screen.getByTestId('page-summary')).toBeInTheDocument()
  })

  it('shows no-trip placeholder on list before a trip is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-list'))
    expect(screen.getByTestId('no-trip')).toBeInTheDocument()
  })
})

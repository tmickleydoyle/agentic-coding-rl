import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the overview by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-overview')).toBeInTheDocument()
    expect(screen.getByTestId('nav-overview')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-categories')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the categories page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('page-categories')).toBeInTheDocument()
    expect(screen.getByTestId('nav-categories')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-overview')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add-expense page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-expense'))
    expect(screen.getByTestId('page-add-expense')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add-expense')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to overview', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-overview'))
    expect(screen.getByTestId('page-overview')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

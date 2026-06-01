import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders inbox by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-inbox')).toBeInTheDocument()
    expect(screen.getByTestId('nav-inbox')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-stats')).not.toHaveAttribute('aria-current')
  })

  it('navigates to categories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('page-categories')).toBeInTheDocument()
    expect(screen.getByTestId('nav-categories')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to stats', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('page-stats')).toBeInTheDocument()
  })

  it('navigates to item-detail and back to inbox', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-item-detail'))
    expect(screen.getByTestId('page-item-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-inbox'))
    expect(screen.getByTestId('page-inbox')).toBeInTheDocument()
    expect(screen.getByTestId('nav-item-detail')).not.toHaveAttribute('aria-current')
  })
})

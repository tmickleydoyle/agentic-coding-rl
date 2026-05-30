import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the events page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-events')).toBeInTheDocument()
    expect(screen.getByTestId('nav-events')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-my-events')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the create page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
    expect(screen.getByTestId('nav-create')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the my-events page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-events'))
    expect(screen.getByTestId('page-my-events')).toBeInTheDocument()
  })

  it('shows a no-selection message on detail before an event is chosen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-event-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })

  it('toggles theme and persists it across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('theme-toggle'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
    await user.click(screen.getByTestId('nav-my-events'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'dark')
  })
})

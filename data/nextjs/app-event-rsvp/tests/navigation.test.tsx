import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders events by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-events')).toBeInTheDocument()
    expect(screen.getByTestId('nav-events')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-create')).not.toHaveAttribute('aria-current')
  })

  it('navigates to create', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
    expect(screen.getByTestId('nav-create')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to responses', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-responses'))
    expect(screen.getByTestId('page-responses')).toBeInTheDocument()
  })

  it('navigates to invite-detail and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-invite-detail'))
    expect(screen.getByTestId('page-invite-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-events'))
    expect(screen.getByTestId('page-events')).toBeInTheDocument()
    expect(screen.getByTestId('nav-invite-detail')).not.toHaveAttribute('aria-current')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

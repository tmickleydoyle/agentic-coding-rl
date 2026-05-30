import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the shows page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-shows')).toBeInTheDocument()
    expect(screen.getByTestId('nav-shows')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-queue')).not.toHaveAttribute('aria-current')
  })

  it('navigates to queue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('page-queue')).toBeInTheDocument()
    expect(screen.getByTestId('nav-queue')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to subscriptions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-subscriptions'))
    expect(screen.getByTestId('page-subscriptions')).toBeInTheDocument()
  })

  it('shows no-show on detail before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-show-detail'))
    expect(screen.getByTestId('no-show')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

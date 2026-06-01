import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders classes by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-classes')).toBeInTheDocument()
    expect(screen.getByTestId('nav-classes')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-my-classes')).not.toHaveAttribute('aria-current')
  })

  it('navigates to my classes', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-classes'))
    expect(screen.getByTestId('page-my-classes')).toBeInTheDocument()
    expect(screen.getByTestId('nav-my-classes')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the waitlist', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-waitlist'))
    expect(screen.getByTestId('page-waitlist')).toBeInTheDocument()
  })

  it('shows no-class hint when visiting detail directly', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-class-detail'))
    expect(screen.getByTestId('no-class')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

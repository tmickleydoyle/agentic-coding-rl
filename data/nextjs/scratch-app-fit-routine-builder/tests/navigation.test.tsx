import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the routines page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-routines')).toBeInTheDocument()
    expect(screen.getByTestId('nav-routines')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-builder')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the builder page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-builder'))
    expect(screen.getByTestId('page-builder')).toBeInTheDocument()
    expect(screen.getByTestId('nav-builder')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the week-plan page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-week-plan'))
    expect(screen.getByTestId('page-week-plan')).toBeInTheDocument()
    expect(screen.getByTestId('nav-week-plan')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the library page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-library'))
    expect(screen.getByTestId('page-library')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

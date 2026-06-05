import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the list page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    expect(screen.getByTestId('nav-list')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-tags')).not.toHaveAttribute('aria-current')
  })

  it('navigates to tags', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tags'))
    expect(screen.getByTestId('page-tags')).toBeInTheDocument()
    expect(screen.getByTestId('nav-tags')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-list'))
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

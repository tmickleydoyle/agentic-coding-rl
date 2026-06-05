import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the home page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-home')).toBeInTheDocument()
    expect(screen.getByTestId('nav-home')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-projects')).not.toHaveAttribute('aria-current')
  })

  it('navigates to projects and writing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-projects'))
    expect(screen.getByTestId('page-projects')).toBeInTheDocument()
    expect(screen.getByTestId('nav-projects')).toHaveAttribute('aria-current', 'page')
    await user.click(screen.getByTestId('nav-writing'))
    expect(screen.getByTestId('page-writing')).toBeInTheDocument()
    expect(screen.getByTestId('nav-projects')).not.toHaveAttribute('aria-current')
  })

  it('reflects light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('shows a no-project message on detail before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-project-detail'))
    expect(screen.getByTestId('no-project')).toBeInTheDocument()
  })
})

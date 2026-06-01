import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the projects page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-projects')).toBeInTheDocument()
    expect(screen.getByTestId('nav-projects')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-members')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the members page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-members'))
    expect(screen.getByTestId('page-members')).toBeInTheDocument()
    expect(screen.getByTestId('nav-members')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-projects')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the board page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('page-board')).toBeInTheDocument()
    expect(screen.getByTestId('nav-board')).toHaveAttribute('aria-current', 'page')
  })

  it('shows a no-project message on the detail page before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-project-detail'))
    expect(screen.getByTestId('page-project-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-project')).toBeInTheDocument()
  })
})

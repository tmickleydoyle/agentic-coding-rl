import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the week page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-week')).toBeInTheDocument()
    expect(screen.getByTestId('nav-week')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-projects')).not.toHaveAttribute('aria-current')
  })

  it('navigates to projects', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-projects'))
    expect(screen.getByTestId('page-projects')).toBeInTheDocument()
    expect(screen.getByTestId('nav-projects')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-week')).not.toHaveAttribute('aria-current')
  })

  it('navigates to approvals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-approvals'))
    expect(screen.getByTestId('page-approvals')).toBeInTheDocument()
    expect(screen.getByTestId('nav-approvals')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to log-entry and back to week', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-log-entry'))
    expect(screen.getByTestId('page-log-entry')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-week'))
    expect(screen.getByTestId('page-week')).toBeInTheDocument()
  })
})

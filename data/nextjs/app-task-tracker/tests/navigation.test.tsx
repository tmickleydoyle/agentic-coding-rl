import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the dashboard by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-dashboard')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-tasks')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the tasks page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('page-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('nav-tasks')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-dashboard')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the new task page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-new'))
    expect(screen.getByTestId('page-new')).toBeInTheDocument()
    expect(screen.getByTestId('nav-new')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

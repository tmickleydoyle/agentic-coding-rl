import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the tasks page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('nav-tasks')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-focus')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the focus page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-focus'))
    expect(screen.getByTestId('page-focus')).toBeInTheDocument()
    expect(screen.getByTestId('nav-focus')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the stats page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-stats'))
    expect(screen.getByTestId('page-stats')).toBeInTheDocument()
    expect(screen.getByTestId('nav-stats')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to tasks', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('page-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

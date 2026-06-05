import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the today page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-today')).toBeInTheDocument()
    expect(screen.getByTestId('nav-today')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-tasks')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the tasks page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('page-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('nav-tasks')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the contacts page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-contacts'))
    expect(screen.getByTestId('page-contacts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-contacts')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the done page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-done'))
    expect(screen.getByTestId('page-done')).toBeInTheDocument()
    expect(screen.getByTestId('nav-done')).toHaveAttribute('aria-current', 'page')
  })

  it('reflects the default theme on app-root and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

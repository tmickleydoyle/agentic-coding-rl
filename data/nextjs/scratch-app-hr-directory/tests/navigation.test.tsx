import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders directory by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-directory')).toBeInTheDocument()
    expect(screen.getByTestId('nav-directory')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-departments')).not.toHaveAttribute('aria-current')
  })

  it('navigates to departments', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-departments'))
    expect(screen.getByTestId('page-departments')).toBeInTheDocument()
    expect(screen.getByTestId('nav-departments')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to org', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-org'))
    expect(screen.getByTestId('page-org')).toBeInTheDocument()
  })

  it('navigates to profile and back to directory', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-profile'))
    expect(screen.getByTestId('page-profile')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-directory'))
    expect(screen.getByTestId('page-directory')).toBeInTheDocument()
    expect(screen.getByTestId('nav-profile')).not.toHaveAttribute('aria-current')
  })
})

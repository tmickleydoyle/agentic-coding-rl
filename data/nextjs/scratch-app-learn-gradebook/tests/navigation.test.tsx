import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the students page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-students')).toBeInTheDocument()
    expect(screen.getByTestId('nav-students')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-summary')).not.toHaveAttribute('aria-current')
  })

  it('navigates to gradebook and summary', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-gradebook'))
    expect(screen.getByTestId('page-gradebook')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-summary'))
    expect(screen.getByTestId('page-summary')).toBeInTheDocument()
    expect(screen.getByTestId('nav-gradebook')).not.toHaveAttribute('aria-current')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

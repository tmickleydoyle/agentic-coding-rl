import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the contacts page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-contacts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-contacts')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-companies')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the companies page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-companies'))
    expect(screen.getByTestId('page-companies')).toBeInTheDocument()
    expect(screen.getByTestId('nav-companies')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the activity page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-activity'))
    expect(screen.getByTestId('page-activity')).toBeInTheDocument()
    expect(screen.getByTestId('nav-activity')).toHaveAttribute('aria-current', 'page')
  })

  it('shows a no-contact message on the detail page before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-contact-detail'))
    expect(screen.getByTestId('page-contact-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-contact')).toBeInTheDocument()
  })

  it('reflects the default theme on app-root and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-companies'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

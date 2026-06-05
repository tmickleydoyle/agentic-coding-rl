import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the requests page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-requests')).toBeInTheDocument()
    expect(screen.getByTestId('nav-requests')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-balances')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the balances page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-balances'))
    expect(screen.getByTestId('page-balances')).toBeInTheDocument()
    expect(screen.getByTestId('nav-balances')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-requests')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the calendar page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-calendar'))
    expect(screen.getByTestId('page-calendar')).toBeInTheDocument()
    expect(screen.getByTestId('nav-calendar')).toHaveAttribute('aria-current', 'page')
  })

  it('shows a no-request message on the detail page before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-request-detail'))
    expect(screen.getByTestId('page-request-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-request')).toBeInTheDocument()
  })

  it('keeps theme on the root element across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-calendar'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

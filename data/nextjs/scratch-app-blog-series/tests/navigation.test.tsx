import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the series page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-series')).toBeInTheDocument()
    expect(screen.getByTestId('nav-series')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-reader')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add-part page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-part'))
    expect(screen.getByTestId('page-add-part')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add-part')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to detail and reader', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-series-detail'))
    expect(screen.getByTestId('page-series-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-reader'))
    expect(screen.getByTestId('page-reader')).toBeInTheDocument()
    expect(screen.getByTestId('nav-series-detail')).not.toHaveAttribute('aria-current')
  })

  it('defaults to light theme and toggling is not exposed in nav', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })

  it('shows a no-series message on detail before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-series-detail'))
    expect(screen.getByTestId('no-series')).toBeInTheDocument()
  })
})

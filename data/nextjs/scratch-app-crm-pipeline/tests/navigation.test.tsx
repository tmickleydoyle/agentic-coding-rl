import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the pipeline page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-pipeline')).toBeInTheDocument()
    expect(screen.getByTestId('nav-pipeline')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-contacts')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the contacts page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-contacts'))
    expect(screen.getByTestId('page-contacts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-contacts')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-pipeline')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the forecast page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-forecast'))
    expect(screen.getByTestId('page-forecast')).toBeInTheDocument()
    expect(screen.getByTestId('nav-forecast')).toHaveAttribute('aria-current', 'page')
  })

  it('shows a no-deal message on the detail page before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-deal-detail'))
    expect(screen.getByTestId('page-deal-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-deal')).toBeInTheDocument()
  })

  it('reflects the default theme on app-root and persists across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-forecast'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

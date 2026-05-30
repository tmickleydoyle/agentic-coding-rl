import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders dashboard by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-dashboard')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-targets')).not.toHaveAttribute('aria-current')
  })

  it('navigates to targets', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-targets'))
    expect(screen.getByTestId('page-targets')).toBeInTheDocument()
    expect(screen.getByTestId('nav-targets')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to history', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
  })

  it('navigates to kpi-detail and back to dashboard', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-kpi-detail'))
    expect(screen.getByTestId('page-kpi-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-dashboard'))
    expect(screen.getByTestId('page-dashboard')).toBeInTheDocument()
    expect(screen.getByTestId('nav-kpi-detail')).not.toHaveAttribute('aria-current')
  })
})

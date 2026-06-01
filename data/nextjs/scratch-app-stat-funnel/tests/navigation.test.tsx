import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the funnel page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-funnel')).toBeInTheDocument()
    expect(screen.getByTestId('nav-funnel')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-steps')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the steps route', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-steps'))
    expect(screen.getByTestId('page-steps')).toBeInTheDocument()
    expect(screen.getByTestId('nav-steps')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-funnel')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the segments route', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-segments'))
    expect(screen.getByTestId('page-segments')).toBeInTheDocument()
    expect(screen.getByTestId('nav-segments')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to funnel', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-funnel'))
    expect(screen.getByTestId('page-funnel')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

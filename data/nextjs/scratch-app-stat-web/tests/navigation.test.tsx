import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the overview page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-overview')).toBeInTheDocument()
    expect(screen.getByTestId('nav-overview')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-pages')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the pages route', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-pages'))
    expect(screen.getByTestId('page-pages')).toBeInTheDocument()
    expect(screen.getByTestId('nav-pages')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-overview')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the sources route', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-sources'))
    expect(screen.getByTestId('page-sources')).toBeInTheDocument()
    expect(screen.getByTestId('nav-sources')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to settings and back to overview', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-overview'))
    expect(screen.getByTestId('page-overview')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})

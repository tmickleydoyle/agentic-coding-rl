import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the roadmap by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-roadmap')).toBeInTheDocument()
    expect(screen.getByTestId('nav-roadmap')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-timeline')).not.toHaveAttribute('aria-current')
  })

  it('navigates to timeline', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-timeline'))
    expect(screen.getByTestId('page-timeline')).toBeInTheDocument()
    expect(screen.getByTestId('nav-timeline')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-roadmap')).not.toHaveAttribute('aria-current')
  })

  it('navigates to add', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
  })

  it('shows no-initiative on detail before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-initiative-detail'))
    expect(screen.getByTestId('no-initiative')).toBeInTheDocument()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders browse by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-browse')).toBeInTheDocument()
    expect(screen.getByTestId('nav-browse')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-post')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the post page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-post'))
    expect(screen.getByTestId('page-post')).toBeInTheDocument()
    expect(screen.getByTestId('nav-post')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to favorites and back to browse', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-favorites'))
    expect(screen.getByTestId('page-favorites')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-browse'))
    expect(screen.getByTestId('page-browse')).toBeInTheDocument()
    expect(screen.getByTestId('nav-favorites')).not.toHaveAttribute('aria-current')
  })

  it('shows the no-selection state on detail with nothing selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-detail'))
    expect(screen.getByTestId('no-selection')).toBeInTheDocument()
  })
})

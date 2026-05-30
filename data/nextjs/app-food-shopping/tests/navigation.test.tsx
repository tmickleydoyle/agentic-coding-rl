import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the list page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    expect(screen.getByTestId('nav-list')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-add')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add'))
    expect(screen.getByTestId('page-add')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the aisles page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-aisles'))
    expect(screen.getByTestId('page-aisles')).toBeInTheDocument()
  })

  it('navigates to history and back to list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-list'))
    expect(screen.getByTestId('page-list')).toBeInTheDocument()
    expect(screen.getByTestId('nav-history')).not.toHaveAttribute('aria-current')
  })

  it('shows the remaining badge from seed data', () => {
    render(<App />)
    // 4 items, 1 bought (Cheddar) -> 3 remaining
    expect(screen.getByTestId('remaining-badge')).toHaveTextContent('3')
  })
})

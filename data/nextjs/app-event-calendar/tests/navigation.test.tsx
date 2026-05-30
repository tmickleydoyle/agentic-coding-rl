import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders month by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-month')).toBeInTheDocument()
    expect(screen.getByTestId('nav-month')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-create')).not.toHaveAttribute('aria-current')
  })

  it('navigates to create', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
    expect(screen.getByTestId('nav-create')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to categories', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('page-categories')).toBeInTheDocument()
  })

  it('navigates to event-detail and back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-event-detail'))
    expect(screen.getByTestId('page-event-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-month'))
    expect(screen.getByTestId('page-month')).toBeInTheDocument()
    expect(screen.getByTestId('nav-event-detail')).not.toHaveAttribute('aria-current')
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

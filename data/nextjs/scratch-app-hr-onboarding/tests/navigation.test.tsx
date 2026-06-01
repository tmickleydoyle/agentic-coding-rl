import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the hires page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-hires')).toBeInTheDocument()
    expect(screen.getByTestId('nav-hires')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-tasks')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the tasks page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-tasks'))
    expect(screen.getByTestId('page-tasks')).toBeInTheDocument()
    expect(screen.getByTestId('nav-tasks')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-hires')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the progress page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-progress'))
    expect(screen.getByTestId('page-progress')).toBeInTheDocument()
    expect(screen.getByTestId('nav-progress')).toHaveAttribute('aria-current', 'page')
  })

  it('shows a no-hire message on the detail page before selecting', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-hire-detail'))
    expect(screen.getByTestId('page-hire-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-hire')).toBeInTheDocument()
  })

  it('keeps theme on the root element across navigation', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    await user.click(screen.getByTestId('nav-progress'))
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

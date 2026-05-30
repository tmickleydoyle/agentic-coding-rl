import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the catalog by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-catalog')).toBeInTheDocument()
    expect(screen.getByTestId('nav-catalog')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-my-courses')).not.toHaveAttribute('aria-current')
  })

  it('navigates to my-courses and progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-my-courses'))
    expect(screen.getByTestId('page-my-courses')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-progress'))
    expect(screen.getByTestId('page-progress')).toBeInTheDocument()
    expect(screen.getByTestId('nav-my-courses')).not.toHaveAttribute('aria-current')
  })

  it('shows no-course on the detail page before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-course-detail'))
    expect(screen.getByTestId('no-course')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

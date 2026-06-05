import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the posts page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-posts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-posts')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-editor')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the editor page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-editor'))
    expect(screen.getByTestId('page-editor')).toBeInTheDocument()
    expect(screen.getByTestId('nav-editor')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the categories page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-categories'))
    expect(screen.getByTestId('page-categories')).toBeInTheDocument()
  })

  it('navigates to published and back to posts', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-published'))
    expect(screen.getByTestId('page-published')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-posts'))
    expect(screen.getByTestId('page-posts')).toBeInTheDocument()
    expect(screen.getByTestId('nav-published')).not.toHaveAttribute('aria-current')
  })
})

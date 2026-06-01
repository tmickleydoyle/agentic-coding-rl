import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the notebooks page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-notebooks')).toBeInTheDocument()
    expect(screen.getByTestId('nav-notebooks')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-notes')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the editor page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-editor'))
    expect(screen.getByTestId('page-editor')).toBeInTheDocument()
    expect(screen.getByTestId('nav-editor')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the search page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-search'))
    expect(screen.getByTestId('page-search')).toBeInTheDocument()
    expect(screen.getByTestId('nav-search')).toHaveAttribute('aria-current', 'page')
  })

  it('shows the no-notebook prompt on notes before one is selected', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-notes'))
    expect(screen.getByTestId('page-notes')).toBeInTheDocument()
    expect(screen.getByTestId('no-notebook')).toBeInTheDocument()
  })

  it('defaults to light theme reflected on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

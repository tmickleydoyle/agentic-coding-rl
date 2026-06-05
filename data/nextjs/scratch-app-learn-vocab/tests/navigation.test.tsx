import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the lists page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-lists')).toBeInTheDocument()
    expect(screen.getByTestId('nav-lists')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-progress')).not.toHaveAttribute('aria-current')
  })

  it('navigates to add-word and progress', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-word'))
    expect(screen.getByTestId('page-add-word')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-progress'))
    expect(screen.getByTestId('page-progress')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add-word')).not.toHaveAttribute('aria-current')
  })

  it('shows no-list on practice before opening a list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-practice'))
    expect(screen.getByTestId('no-list')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

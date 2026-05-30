import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the issues page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-issues')).toBeInTheDocument()
    expect(screen.getByTestId('nav-issues')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-board')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the triage page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-triage'))
    expect(screen.getByTestId('page-triage')).toBeInTheDocument()
    expect(screen.getByTestId('nav-triage')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-issues')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the board page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-board'))
    expect(screen.getByTestId('page-board')).toBeInTheDocument()
    expect(screen.getByTestId('nav-board')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to detail and back to issues', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-issue-detail'))
    expect(screen.getByTestId('page-issue-detail')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-issues'))
    expect(screen.getByTestId('page-issues')).toBeInTheDocument()
    expect(screen.getByTestId('nav-issue-detail')).not.toHaveAttribute('aria-current')
  })
})

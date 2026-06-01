import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the queue page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-queue')).toBeInTheDocument()
    expect(screen.getByTestId('nav-queue')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-canned')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the canned page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-canned'))
    expect(screen.getByTestId('page-canned')).toBeInTheDocument()
    expect(screen.getByTestId('nav-canned')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-queue')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the history page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-history'))
    expect(screen.getByTestId('page-history')).toBeInTheDocument()
    expect(screen.getByTestId('nav-history')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to chat then back to queue', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-chat'))
    expect(screen.getByTestId('page-chat')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-queue'))
    expect(screen.getByTestId('page-queue')).toBeInTheDocument()
    expect(screen.getByTestId('nav-chat')).not.toHaveAttribute('aria-current')
  })
})

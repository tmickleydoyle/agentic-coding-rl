import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders channel by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-channel')).toBeInTheDocument()
    expect(screen.getByTestId('nav-channel')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-uploads')).not.toHaveAttribute('aria-current')
  })

  it('navigates to uploads and subscriptions', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-uploads'))
    expect(screen.getByTestId('page-uploads')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-subscriptions'))
    expect(screen.getByTestId('page-subscriptions')).toBeInTheDocument()
    expect(screen.getByTestId('nav-uploads')).not.toHaveAttribute('aria-current')
  })

  it('shows no-video on detail before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-video-detail'))
    expect(screen.getByTestId('no-video')).toBeInTheDocument()
  })

  it('defaults to light theme and channel ch1 selected', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
    expect(screen.getByTestId('channel-name')).toHaveTextContent('CodeCast')
  })
})

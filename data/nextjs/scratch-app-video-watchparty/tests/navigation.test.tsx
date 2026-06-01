import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders parties by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-parties')).toBeInTheDocument()
    expect(screen.getByTestId('nav-parties')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-create')).not.toHaveAttribute('aria-current')
  })

  it('navigates to create and my-parties', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-create'))
    expect(screen.getByTestId('page-create')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-my-parties'))
    expect(screen.getByTestId('page-my-parties')).toBeInTheDocument()
    expect(screen.getByTestId('nav-create')).not.toHaveAttribute('aria-current')
  })

  it('shows no-party on detail before opening one', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-party-detail'))
    expect(screen.getByTestId('no-party')).toBeInTheDocument()
  })

  it('defaults to light theme on the root', () => {
    render(<App />)
    expect(screen.getByTestId('app-root')).toHaveAttribute('data-theme', 'light')
  })
})

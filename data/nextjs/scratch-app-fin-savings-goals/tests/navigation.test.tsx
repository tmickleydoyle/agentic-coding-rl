import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../app/page'

describe('navigation', () => {
  it('renders the goals page by default with active nav', () => {
    render(<App />)
    expect(screen.getByTestId('page-goals')).toBeInTheDocument()
    expect(screen.getByTestId('nav-goals')).toHaveAttribute('aria-current', 'page')
    expect(screen.getByTestId('nav-add-goal')).not.toHaveAttribute('aria-current')
  })

  it('navigates to the add-goal page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-add-goal'))
    expect(screen.getByTestId('page-add-goal')).toBeInTheDocument()
    expect(screen.getByTestId('nav-add-goal')).toHaveAttribute('aria-current', 'page')
  })

  it('navigates to the detail page (no goal selected)', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-goal-detail'))
    expect(screen.getByTestId('page-goal-detail')).toBeInTheDocument()
    expect(screen.getByTestId('no-goal-selected')).toBeInTheDocument()
  })

  it('navigates to settings and back to goals', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('nav-settings'))
    expect(screen.getByTestId('page-settings')).toBeInTheDocument()
    await user.click(screen.getByTestId('nav-goals'))
    expect(screen.getByTestId('page-goals')).toBeInTheDocument()
    expect(screen.getByTestId('nav-settings')).not.toHaveAttribute('aria-current')
  })
})
